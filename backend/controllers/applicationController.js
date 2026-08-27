import asyncHandler from "express-async-handler";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @desc  Apply to a job (job seeker only)
// @route POST /api/applications/jobs/:jobId
export const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job || job.status !== "approved") {
    res.status(404);
    throw new Error("Job not found or not currently accepting applications");
  }

  const existing = await Application.findOne({ job: job._id, seeker: req.user._id });
  if (existing) {
    res.status(400);
    throw new Error("You have already applied to this job");
  }

  const application = await Application.create({
    job: job._id,
    seeker: req.user._id,
    resumeUrl: req.body.resumeUrl,
    coverNote: req.body.coverNote,
  });

  res.status(201).json(application);
});

// @desc  Get applications submitted by the logged-in seeker
// @route GET /api/applications/mine
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ seeker: req.user._id })
    .populate({ path: "job", select: "title location employer", populate: { path: "employer", select: "name" } })
    .sort("-createdAt");
  res.json(applications);
});

// @desc  Get applicants for a specific job (employer who owns the job, or admin)
// @route GET /api/applications/jobs/:jobId
export const getApplicationsForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const isOwner = job.employer.toString() === req.user._id.toString();
  const isPrivileged = ["admin", "superadmin"].includes(req.user.role);
  if (!isOwner && !isPrivileged) {
    res.status(403);
    throw new Error("You do not have permission to view these applications");
  }

  const applications = await Application.find({ job: job._id })
    .populate("seeker", "name email phone")
    .sort("-createdAt");

  res.json(applications);
});

// @desc  Update an application's status (shortlist / reject / hire)
// @route PATCH /api/applications/:id/status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["applied", "viewed", "shortlisted", "rejected", "hired"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const application = await Application.findById(req.params.id).populate("job");
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  const isOwner = application.job.employer.toString() === req.user._id.toString();
  const isPrivileged = ["admin", "superadmin"].includes(req.user.role);
  if (!isOwner && !isPrivileged) {
    res.status(403);
    throw new Error("You do not have permission to update this application");
  }

  application.status = status;
  await application.save();
  res.json(application);
});
