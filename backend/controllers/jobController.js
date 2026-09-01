import asyncHandler from "express-async-handler";
import Job from "../models/Job.js";
import EmployerProfile from "../models/EmployerProfile.js";

// @desc  Create a job (employer or admin/superadmin)
// @route POST /api/jobs
export const createJob = asyncHandler(async (req, res) => {
  const isPrivileged = ["admin", "superadmin"].includes(req.user.role);

  if (!isPrivileged) {
    const employerProfile = await EmployerProfile.findOne({ user: req.user._id });
    if (!employerProfile || employerProfile.verificationStatus !== "approved") {
      res.status(403);
      throw new Error("Your employer account must be verified before posting jobs");
    }
  }

  // Admin-created jobs are automatically approved; employer jobs are pending review
  const initialStatus = isPrivileged ? (req.body.status || "approved") : "pending";

  const job = await Job.create({
    ...req.body,
    employer: req.user._id,
    status: initialStatus,
  });

  res.status(201).json(job);
});

// @desc  Public job search & listing with filters
// @route GET /api/jobs
export const getJobs = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    employmentType,
    experienceLevel,
    location,
    minSalary,
    maxSalary,
    sort = "-createdAt",
    page = 1,
    limit = 12,
  } = req.query;

  const query = { status: "approved" };

  if (keyword && keyword.trim()) {
    const keywordRegex = { $regex: keyword.trim(), $options: "i" };
    query.$or = [
      { title: keywordRegex },
      { companyName: keywordRegex },
      { description: keywordRegex },
      { cropTags: keywordRegex },
      { requirements: keywordRegex },
      { responsibilities: keywordRegex },
    ];
  }

  if (category) query.category = category;
  if (employmentType) query.employmentType = employmentType;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (location && location.trim()) query.location = { $regex: location.trim(), $options: "i" };
  if (minSalary) query.salaryMax = { $gte: Number(minSalary) };
  if (maxSalary) query.salaryMin = { ...(query.salaryMin || {}), $lte: Number(maxSalary) };

  const skip = (Number(page) - 1) * Number(limit);

  const sortOption = sort === "-createdAt" ? "-isFeatured -isUrgent -createdAt" : sort;

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate("category", "name slug icon")
      .populate("employer", "name")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit)),
    Job.countDocuments(query),
  ]);

  res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @desc  Get single job by id (increments view count)
// @route GET /api/jobs/:id
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("category", "name slug icon")
    .populate("employer", "name");

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  job.views += 1;
  await job.save();

  res.json(job);
});

// @desc  Update a job (owner employer or admin/superadmin)
// @route PATCH /api/jobs/:id
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const isOwner = job.employer.toString() === req.user._id.toString();
  const isPrivileged = ["admin", "superadmin"].includes(req.user.role);
  if (!isOwner && !isPrivileged) {
    res.status(403);
    throw new Error("You do not have permission to edit this job");
  }

  // If an employer edits an approved job, send it back for re-approval
  const fieldsToUpdate = { ...req.body };
  if (isOwner && !isPrivileged) {
    fieldsToUpdate.status = "pending";
  }

  Object.assign(job, fieldsToUpdate);
  await job.save();
  res.json(job);
});

// @desc  Delete / close a job
// @route DELETE /api/jobs/:id
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const isOwner = job.employer.toString() === req.user._id.toString();
  const isPrivileged = ["admin", "superadmin"].includes(req.user.role);
  if (!isOwner && !isPrivileged) {
    res.status(403);
    throw new Error("You do not have permission to delete this job");
  }

  await job.deleteOne();
  res.json({ message: "Job removed" });
});

// @desc  Get jobs posted by the logged-in employer
// @route GET /api/jobs/employer/mine
export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id })
    .populate("category", "name slug")
    .sort("-createdAt");
  res.json(jobs);
});
