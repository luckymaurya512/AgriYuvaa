import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import EmployerProfile from "../models/EmployerProfile.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import AuditLog from "../models/AuditLog.js";
import { broadcastNewJobAlert } from "../utils/webPush.js";

import sendEmail from "../utils/sendEmail.js";

const logAction = async (actor, action, targetType, targetId, meta = {}) => {
  await AuditLog.create({ actor: actor._id, action, targetType, targetId, meta });
};

// @desc  Platform-wide stats for the dashboard
// @route GET /api/admin/stats
export const getPlatformStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalEmployers, totalSeekers, totalJobs, approvedJobs, pendingJobs, totalApplications] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "employer" }),
      User.countDocuments({ role: "seeker" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "approved" }),
      Job.countDocuments({ status: "pending" }),
      Application.countDocuments(),
    ]);

  res.json({ totalUsers, totalEmployers, totalSeekers, totalJobs, approvedJobs, pendingJobs, totalApplications });
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

  const users = await User.find(query).select("-passwordHash").sort("-createdAt");
  res.json(users);
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
  user.role = "admin";
  user.status = "active";
  await user.save();

  await logAction(req.user, "upgrade_to_admin", "User", user._id, { previousRole, newRole: "admin" });

  // 📧 Send email notification to the newly upgraded admin
  sendEmail({
    to: user.email,
    subject: "🎉 You have been granted Admin privileges on AgriYuvaa",
    html: `
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
          <p style="margin: 0;">Log in using your existing email (<strong>${user.email}</strong>) and your current account password. You now have full access to:</p>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4b5563;">
            <li>Admin Dashboard & analytics</li>
            <li>Employer verification approvals</li>
            <li>Job listing reviews & moderation</li>
            <li>Direct job posting without moderation</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="https://frontend-lime-nine-60.vercel.app/admin" style="display: inline-block; background-color: #15803d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Access Admin Dashboard →</a>
        </div>
      </div>
    `,
  }).catch((err) => console.error("Admin upgrade email notification error:", err));

  res.json({
    message: `"${user.name}" (${user.email}) has been successfully upgraded to Admin!`,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
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
  await user.save();

  await logAction(req.user, "update_user_role", "User", user._id, { previousRole, newRole: role });

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
    broadcastNewJobAlert(job, employerProfile).catch(() => {});
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
