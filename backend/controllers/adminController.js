import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import EmployerProfile from "../models/EmployerProfile.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import AuditLog from "../models/AuditLog.js";

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

// @desc  Create a new Admin account (Super Admin only)
// @route POST /api/admin/admins
export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }
  const admin = await User.create({ name, email, phone, passwordHash: password, role: "admin" });
  await logAction(req.user, "create_admin", "User", admin._id);
  res.status(201).json({ id: admin._id, name: admin.name, email: admin.email, role: admin.role });
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
