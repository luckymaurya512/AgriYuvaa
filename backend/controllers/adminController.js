import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import EmployerProfile from "../models/EmployerProfile.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import AuditLog from "../models/AuditLog.js";
import SeekerProfile from "../models/SeekerProfile.js";
import Notification from "../models/Notification.js";
import { broadcastNewJobAlert } from "../utils/webPush.js";

import sendEmail from "../utils/sendEmail.js";

const logAction = async (actor, action, targetType, targetId, meta = {}) => {
  await AuditLog.create({ actor: actor._id, action, targetType, targetId, meta });
};

// @desc  Platform-wide stats for the dashboard
// @route GET /api/admin/stats
export const getPlatformStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalEmployers,
    totalSeekers,
    totalJobs,
    approvedJobs,
    pendingJobs,
    totalApplications,
    resumesCreatedWithBuilder,
    resumesUploaded,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "employer" }),
    User.countDocuments({ role: "seeker" }),
    Job.countDocuments(),
    Job.countDocuments({ status: "approved" }),
    Job.countDocuments({ status: "pending" }),
    Application.countDocuments(),
    SeekerProfile.countDocuments({
      $or: [
        { resumeBuilderUpdatedAt: { $exists: true, $ne: null } },
        { activeResumeType: "builder" },
        { "resumeData.fullName": { $exists: true, $ne: "" } },
        { "resumeData.basics.name": { $exists: true, $ne: "" } },
      ],
    }),
    SeekerProfile.countDocuments({
      $or: [
        { resumeFileData: { $exists: true, $ne: null, $ne: "" } },
        { resumeUrl: { $exists: true, $ne: null, $ne: "" } },
        { resumeUploadedAt: { $exists: true, $ne: null } },
      ],
    }),
  ]);

  res.json({
    totalUsers,
    totalEmployers,
    totalSeekers,
    totalJobs,
    approvedJobs,
    pendingJobs,
    totalApplications,
    resumesCreatedWithBuilder,
    resumesUploaded,
  });
});

// @desc  List all users (filterable by role/status) — Super Admin full, Admin limited
// @route GET /api/admin/users
export const listUsers = asyncHandler(async (req, res) => {
  const { role, status } = req.query;
  const query = {};
  if (role) query.role = role;
  if (status) query.status = status;

  // Admins cannot see other admins/superadmins
  if (req.user.role === "admin") {
    query.role = { $in: ["employer", "seeker"] };
  }

  const users = await User.find(query).select("-passwordHash").sort("-createdAt").lean();

  // Attach employer profile flag for accurate original role detection
  const employerProfiles = await EmployerProfile.find({}, "user").lean();
  const employerUserIds = new Set(employerProfiles.map((p) => p.user?.toString()).filter(Boolean));

  // Query seekerProfiles for fallback phone numbers and resume tracking
  const seekerProfiles = await SeekerProfile.find(
    {},
    "user resumeData resumeBuilderUpdatedAt resumeUploadedAt resumeUrl resumeFileData activeResumeType"
  ).lean();
  const seekerInfoMap = new Map();
  seekerProfiles.forEach((sp) => {
    if (sp.user) {
      const phone =
        sp.resumeData?.basics?.phone ||
        sp.resumeData?.phone ||
        sp.resumeData?.personalInfo?.phone ||
        "";
      const hasBuilderResume = Boolean(
        sp.resumeBuilderUpdatedAt ||
        sp.activeResumeType === "builder" ||
        sp.resumeData?.fullName ||
        sp.resumeData?.basics?.name
      );
      const hasUploadedResume = Boolean(
        sp.resumeFileData ||
        sp.resumeUrl ||
        sp.resumeUploadedAt
      );
      seekerInfoMap.set(sp.user.toString(), {
        phone: phone && String(phone).trim() ? String(phone).trim() : "",
        hasBuilderResume,
        hasUploadedResume,
        resumeBuilderUpdatedAt: sp.resumeBuilderUpdatedAt || null,
        resumeUploadedAt: sp.resumeUploadedAt || null,
      });
    }
  });

  const enrichedUsers = users.map((u) => {
    const hasEmpProfile = employerUserIds.has(u._id.toString());
    const originalRole = u.previousRole || (hasEmpProfile ? "employer" : "seeker");
    const seekerInfo = seekerInfoMap.get(u._id.toString()) || {};
    const resolvedPhone = u.phone || seekerInfo.phone || "";
    return {
      ...u,
      phone: resolvedPhone,
      hasEmployerProfile: hasEmpProfile,
      originalRole,
      hasBuilderResume: seekerInfo.hasBuilderResume || false,
      hasUploadedResume: seekerInfo.hasUploadedResume || false,
      resumeBuilderUpdatedAt: seekerInfo.resumeBuilderUpdatedAt || null,
      resumeUploadedAt: seekerInfo.resumeUploadedAt || null,
    };
  });

  res.json(enrichedUsers);
});

// @desc  Suspend / reactivate / edit a user's status
// @route PATCH /api/admin/users/:id/status
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.user.role === "admin" && ["admin", "superadmin"].includes(user.role)) {
    res.status(403);
    throw new Error("Admins cannot modify other admin or super admin accounts");
  }

  user.status = status;
  await user.save();
  await logAction(req.user, "update_user_status", "User", user._id, { status });
  res.json({ message: "User status updated", user });
});

const sendRoleUpdateEmail = async (user, newRole, previousRole) => {
  try {
    const isUpgradedToAdmin = newRole === "admin";
    const subject = isUpgradedToAdmin
      ? "🎉 You have been granted Admin privileges on AgriYuvaa"
      : `ℹ️ Your AgriYuvaa account role has been updated to ${newRole === "seeker" ? "Job Seeker" : "Employer"}`;

    const html = isUpgradedToAdmin
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #15803d; margin: 0; font-size: 22px;">AgriYuvaa 🌾</h2>
            <p style="color: #6b7280; font-size: 13px; margin-top: 4px;">Role Update Notification</p>
          </div>
          
          <div style="padding: 18px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #16a34a; margin-bottom: 20px;">
            <h3 style="margin: 0 0 8px 0; color: #166534; font-size: 16px;">Congratulations, ${user.name}!</h3>
            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">
              Your registered AgriYuvaa account has been upgraded to <strong>Admin</strong> by the Super Admin.
            </p>
          </div>

          <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px; font-size: 13px; color: #374151;">
            <p style="margin: 0 0 6px 0;"><strong>How to login:</strong></p>
            <p style="margin: 0;">Log in using your existing email (<strong>${user.email}</strong>) and your current account password. You now have access to:</p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4b5563;">
              <li>Admin Dashboard & platform stats</li>
              <li>Employer verification approvals</li>
              <li>Job listing reviews & moderation</li>
              <li>Direct job posting without moderation</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.CLIENT_URL || "https://job.agriyuvaa.com"}/admin" style="display: inline-block; background-color: #15803d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Access Admin Dashboard →</a>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #15803d; margin: 0; font-size: 22px;">AgriYuvaa 🌾</h2>
            <p style="color: #6b7280; font-size: 13px; margin-top: 4px;">Account Role Update</p>
          </div>
          
          <div style="padding: 18px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #6b7280; margin-bottom: 20px;">
            <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 16px;">Hello, ${user.name}</h3>
            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">
              Your AgriYuvaa account role has been updated from <strong>${previousRole}</strong> to <strong>${newRole === "seeker" ? "Job Seeker" : "Employer"}</strong>.
            </p>
          </div>

          <p style="font-size: 13px; color: #4b5563;">You can continue logging in with your registered email and password to access your dashboard.</p>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.CLIENT_URL || "https://job.agriyuvaa.com"}/login" style="display: inline-block; background-color: #15803d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Go to AgriYuvaa →</a>
          </div>
        </div>
      `;

    await sendEmail({ to: user.email, subject, html });
    console.log(`Role update email sent to ${user.email} (new role: ${newRole})`);
  } catch (err) {
    console.error(`Failed to send role update email to ${user.email}:`, err);
  }
};

// @desc  Upgrade an existing registered user to Admin (Super Admin only)
// @route POST /api/admin/admins
export const createAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    res.status(400);
    throw new Error("Please enter the registered user's email address");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error(`No registered user found with email "${email}". The user must create an account first.`);
  }

  if (user.role === "admin") {
    res.status(400);
    throw new Error(`"${user.name}" (${user.email}) is already an Admin.`);
  }

  if (user.role === "superadmin") {
    res.status(400);
    throw new Error("This user is already a Super Admin.");
  }

  const previousRole = user.role;
  user.previousRole = user.role;
  user.role = "admin";
  user.status = "active";
  await user.save();

  await logAction(req.user, "upgrade_to_admin", "User", user._id, { previousRole, newRole: "admin" });

  // 📧 Send email notification to the newly upgraded admin
  await sendRoleUpdateEmail(user, "admin", previousRole);

  res.json({
    message: `"${user.name}" (${user.email}) has been successfully upgraded to Admin!`,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, previousRole: user.previousRole },
  });
});

// @desc  Update user role (Super Admin only - e.g. demote admin to seeker or promote)
// @route PATCH /api/admin/users/:id/role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["seeker", "employer", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role specified");
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "superadmin") {
    res.status(403);
    throw new Error("Super Admin role cannot be modified");
  }

  const previousRole = user.role;
  user.role = role;
  if (role !== "admin") {
    user.previousRole = role;
  }
  await user.save();

  await logAction(req.user, "update_user_role", "User", user._id, { previousRole, newRole: role });

  // 📧 Send email notification on role change (promotion or demotion)
  await sendRoleUpdateEmail(user, role, previousRole);

  res.json({ message: `User role updated to ${role}`, user });
});

// @desc  List pending employer verifications
// @route GET /api/admin/employers/pending
export const getPendingEmployers = asyncHandler(async (req, res) => {
  const employers = await EmployerProfile.find({ verificationStatus: "pending" }).populate(
    "user",
    "name email phone createdAt"
  );
  res.json(employers);
});

// @desc  Approve or reject an employer
// @route PATCH /api/admin/employers/:id/verify
export const verifyEmployer = asyncHandler(async (req, res) => {
  const { decision } = req.body; // "approved" | "rejected"
  const employer = await EmployerProfile.findById(req.params.id);
  if (!employer) {
    res.status(404);
    throw new Error("Employer profile not found");
  }
  employer.verificationStatus = decision;
  await employer.save();
  await logAction(req.user, "verify_employer", "EmployerProfile", employer._id, { decision });
  res.json(employer);
});

// @desc  List all jobs across the platform (filterable for admin)
// @route GET /api/admin/jobs
export const listAllJobs = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};
  if (status && status !== "all") filter.status = status;
  if (search && search.trim()) {
    const regex = { $regex: search.trim(), $options: "i" };
    filter.$or = [{ title: regex }, { companyName: regex }, { location: regex }];
  }

  const jobs = await Job.find(filter)
    .populate("employer", "name email")
    .populate("category", "name")
    .sort("-createdAt");
  res.json(jobs);
});

// @desc  List all job applications across the entire platform (Admin & Super Admin)
// @route GET /api/admin/applications
export const listAllApplications = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};
  if (status && status !== "all") filter.status = status;

  let applications = await Application.find(filter)
    .populate("seeker", "name email phone")
    .populate({
      path: "job",
      select: "title companyName location employer isFeatured isUrgent",
      populate: { path: "employer", select: "name email" },
    })
    .sort("-createdAt");

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    applications = applications.filter((app) => {
      const candidateName = app.seeker?.name?.toLowerCase() || "";
      const candidateEmail = app.seeker?.email?.toLowerCase() || "";
      const jobTitle = app.job?.title?.toLowerCase() || "";
      const companyName = (
        app.job?.companyName ||
        app.job?.employer?.name ||
        ""
      ).toLowerCase();
      return (
        candidateName.includes(q) ||
        candidateEmail.includes(q) ||
        jobTitle.includes(q) ||
        companyName.includes(q)
      );
    });
  }

  // Enrich with candidate profile details (CTC, Notice Period, Organization, etc.)
  const seekerIds = applications.map((a) => a.seeker?._id).filter(Boolean);
  const profiles = await SeekerProfile.find({ user: { $in: seekerIds } }).lean();
  const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

  const enrichedApplications = applications.map((app) => {
    const appObj = app.toObject ? app.toObject() : app;
    if (appObj.seeker?._id) {
      const sp = profileMap.get(appObj.seeker._id.toString());
      if (sp) {
        appObj.seekerProfile = {
          currentOrganization: sp.currentOrganization || "",
          currentDesignation: sp.currentDesignation || "",
          currentCtc: sp.currentCtc || "",
          expectedCtc: sp.expectedCtc || "",
          noticePeriod: sp.noticePeriod || "",
          location: sp.location || "",
          highestQualification: sp.highestQualification || "",
          totalExperience: sp.totalExperience || "",
        };
      }
    }
    return appObj;
  });

  res.json(enrichedApplications);
});

// @desc  List pending job postings
// @route GET /api/admin/jobs/pending
export const getPendingJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ status: "pending" })
    .populate("employer", "name email")
    .populate("category", "name")
    .sort("createdAt");
  res.json(jobs);
});

// @desc  Approve or reject a job posting
// @route PATCH /api/admin/jobs/:id/review
export const reviewJob = asyncHandler(async (req, res) => {
  const { decision, rejectionReason, isFeatured } = req.body; // "approved" | "rejected"
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  job.status = decision;
  if (isFeatured !== undefined) {
    job.isFeatured = Boolean(isFeatured);
  }
  if (decision === "rejected") job.rejectionReason = rejectionReason || "Did not meet posting guidelines";
  await job.save();

  if (decision === "approved") {
    const employerProfile = await EmployerProfile.findOne({ user: job.employer });
    broadcastNewJobAlert(job, employerProfile).catch(() => { });
  }

  await logAction(req.user, "review_job", "Job", job._id, { decision, isFeatured: job.isFeatured });
  res.json(job);
});

// @desc  Toggle featured status on any job (Admin / Super Admin)
// @route PATCH /api/admin/jobs/:id/featured
export const toggleJobFeatured = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  job.isFeatured = !job.isFeatured;
  await job.save();
  await logAction(req.user, "toggle_job_featured", "Job", job._id, { isFeatured: job.isFeatured });
  res.json(job);
});

// @desc  Audit log (Super Admin full, Admin view-only via same route)
// @route GET /api/admin/audit-logs
export const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find().populate("actor", "name role").sort("-createdAt").limit(200);
  res.json(logs);
});

// @desc  List all employers (approved, pending, or rejected) for admin management
// @route GET /api/admin/employers
export const getAllEmployers = asyncHandler(async (req, res) => {
  const employers = await EmployerProfile.find()
    .populate("user", "name email phone status createdAt")
    .sort("-createdAt");
  res.json(employers);
});

// @desc  Delete an employer profile and all related data (cascade)
// @route DELETE /api/admin/employers/:id
export const deleteEmployer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let employer = await EmployerProfile.findById(id);
  if (!employer) {
    employer = await EmployerProfile.findOne({ user: id });
  }

  if (!employer) {
    res.status(404);
    throw new Error("Employer profile not found");
  }

  const userId = employer.user;
  const companyName = employer.companyName;

  const userObj = userId ? await User.findById(userId).select("role") : null;
  const isPrivilegedUser = userObj && ["admin", "superadmin"].includes(userObj.role);

  // 1. Find all jobs posted by this employer (by employer user ID or companyName)
  const queryConditions = [];
  if (companyName) queryConditions.push({ companyName });
  if (userId && !isPrivilegedUser) queryConditions.push({ employer: userId });

  const employerJobs = queryConditions.length > 0 ? await Job.find({ $or: queryConditions }) : [];
  const jobIds = employerJobs.map((j) => j._id);

  // 2. Cascade delete applications for those jobs
  if (jobIds.length > 0) {
    await Application.deleteMany({ job: { $in: jobIds } });
    await Job.deleteMany({ _id: { $in: jobIds } });
  }

  // 3. Remove employer reference from seekers' followed lists
  await SeekerProfile.updateMany(
    { followedEmployers: employer._id },
    { $pull: { followedEmployers: employer._id } }
  );

  // 4. Delete the EmployerProfile document
  await EmployerProfile.findByIdAndDelete(employer._id);

  // 5. Delete the User account if it has role 'employer'
  if (userId) {
    await User.findOneAndDelete({ _id: userId, role: "employer" });
  }

  // 6. Log audit trail
  await logAction(req.user, "delete_employer", "EmployerProfile", employer._id, {
    companyName,
    deletedJobsCount: jobIds.length,
  });

  res.json({
    success: true,
    message: `Employer "${companyName}" and associated data deleted successfully.`,
  });
});

// @desc  Get a user's builder resume data (admin)
// @route GET /api/admin/users/:id/resume
export const getUserResume = asyncHandler(async (req, res) => {
  const profile = await SeekerProfile.findOne({ user: req.params.id });
  if (!profile || !profile.resumeData) {
    res.status(404);
    throw new Error("No builder resume found for this user");
  }
  res.json({ resumeData: profile.resumeData });
});


// @desc  Delete a user account and all related data (cascade)
// @route DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent deleting superadmin
  if (user.role === "superadmin") {
    res.status(403);
    throw new Error("Super Admin accounts cannot be deleted");
  }

  // Admins cannot delete other admins or superadmins
  if (req.user.role === "admin" && ["admin", "superadmin"].includes(user.role)) {
    res.status(403);
    throw new Error("Admins cannot delete admin or superadmin accounts");
  }

  // Account must be suspended before deletion
  if (user.status !== "suspended") {
    res.status(400);
    throw new Error("User account must be suspended before it can be deleted. Please suspend the account first.");
  }

  const userId = user._id;
  let deletedJobsCount = 0;
  let deletedApplicationsCount = 0;

  // 1. If user is an Employer or has an EmployerProfile
  const employerProfile = await EmployerProfile.findOne({ user: userId });
  const companyName = employerProfile?.companyName;

  const jobConditions = [{ employer: userId }];
  if (companyName) jobConditions.push({ companyName });

  const employerJobs = await Job.find({ $or: jobConditions });
  const jobIds = employerJobs.map((j) => j._id);

  if (jobIds.length > 0) {
    // Delete all applications submitted to these jobs
    const jobApps = await Application.deleteMany({ job: { $in: jobIds } });
    deletedApplicationsCount += jobApps.deletedCount || 0;

    // Pull these jobs from seekers' savedJobs
    await SeekerProfile.updateMany(
      { savedJobs: { $in: jobIds } },
      { $pull: { savedJobs: { $in: jobIds } } }
    );

    // Delete the jobs themselves
    const delJobs = await Job.deleteMany({ _id: { $in: jobIds } });
    deletedJobsCount += delJobs.deletedCount || 0;
  }

  if (employerProfile) {
    // Remove employer reference from seekers' followedEmployers
    await SeekerProfile.updateMany(
      { followedEmployers: employerProfile._id },
      { $pull: { followedEmployers: employerProfile._id } }
    );
    // Delete EmployerProfile document
    await EmployerProfile.findByIdAndDelete(employerProfile._id);
  }

  // 2. If user is a Seeker or has submitted applications
  const seekerApps = await Application.deleteMany({ seeker: userId });
  deletedApplicationsCount += seekerApps.deletedCount || 0;

  // Delete SeekerProfile document
  await SeekerProfile.deleteMany({ user: userId });

  // 3. Delete any notifications sent to this user
  await Notification.deleteMany({ recipient: userId });

  // 4. Delete the User document
  await User.findByIdAndDelete(userId);

  // 5. Log audit trail
  await logAction(req.user, "delete_user_account", "User", userId, {
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    deletedJobsCount,
    deletedApplicationsCount,
  });

  res.json({
    success: true,
    message: `Account for "${user.name}" (${user.email}) and all associated data have been permanently deleted.`,
  });
});

