import asyncHandler from "express-async-handler";
import Job from "../models/Job.js";
import User from "../models/User.js";
import EmployerProfile from "../models/EmployerProfile.js";
import { broadcastNewJobAlert } from "../utils/webPush.js";
import sendEmail from "../utils/sendEmail.js";

// @desc  Create a job (employer or admin/superadmin)
// @route POST /api/jobs
export const createJob = asyncHandler(async (req, res) => {
  const isPrivileged = ["admin", "superadmin"].includes(req.user.role);

  let employerProfile = await EmployerProfile.findOne({ user: req.user._id });
  if (!employerProfile && req.user.role === "employer") {
    employerProfile = await EmployerProfile.create({
      user: req.user._id,
      companyName: req.user.name,
      verificationStatus: "approved",
    });
  }

  // Admin-created jobs are automatically approved; employer jobs are pending review
  const initialStatus = isPrivileged ? (req.body.status || "approved") : "pending";
  const isFeatured = isPrivileged ? Boolean(req.body.isFeatured) : false;
  const featuredRequested = !isPrivileged && Boolean(req.body.featuredRequested || req.body.isFeatured);

  let deadline = req.body.applicationDeadline || req.body.expiresAt;
  let parsedDeadline = undefined;
  if (deadline) {
    const d = new Date(deadline);
    if (!isNaN(d.getTime())) {
      if (typeof deadline === "string" && deadline.length <= 10) {
        d.setUTCHours(23, 59, 59, 999);
      }
      parsedDeadline = d;
    }
  }

  const job = await Job.create({
    ...req.body,
    employer: req.user._id,
    status: initialStatus,
    isFeatured,
    featuredRequested,
    applicationDeadline: parsedDeadline,
    expiresAt: parsedDeadline,
  });

  if (initialStatus === "approved") {
    broadcastNewJobAlert(job, employerProfile).catch(() => {});
  } else {
    // 📧 Notify Admins and Superadmins of new job listing awaiting moderation
    try {
      const admins = await User.find({ role: { $in: ["admin", "superadmin"] } }).select("email name");
      const companyDisplayName = job.companyName || employerProfile?.companyName || req.user.name || "Employer";
      for (const admin of admins) {
        sendEmail({
          to: admin.email,
          subject: `📋 New Job Awaiting Approval: "${job.title}" by ${companyDisplayName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #15803d; margin: 0; font-size: 22px;">AgriYuvaa Admin Alert 🌾</h2>
                <p style="color: #6b7280; font-size: 13px; margin-top: 4px;">New Job Listing Pending Moderation</p>
              </div>
              
              <div style="padding: 16px; background-color: #fefce8; border-radius: 8px; border-left: 4px solid #eab308; margin-bottom: 16px;">
                <h3 style="margin: 0 0 8px 0; color: #854d0e; font-size: 16px;">${job.title}</h3>
                <p style="margin: 4px 0; color: #374151; font-size: 14px;"><strong>Company:</strong> ${companyDisplayName}</p>
                <p style="margin: 4px 0; color: #374151; font-size: 14px;"><strong>Location:</strong> ${job.location || "Not specified"}</p>
                <p style="margin: 4px 0; color: #374151; font-size: 14px;"><strong>Type:</strong> ${job.employmentType || "Full-time"}</p>
                ${job.salaryMin || job.salaryMax ? `<p style="margin: 4px 0; color: #374151; font-size: 14px;"><strong>Salary:</strong> ₹${job.salaryMin?.toLocaleString("en-IN") || 0} - ₹${job.salaryMax?.toLocaleString("en-IN") || ""}</p>` : ""}
              </div>

              <p style="color: #4b5563; font-size: 13px; line-height: 1.5;">Please review the job details, verify compliance, and approve the posting so it goes live for candidates.</p>

              <div style="text-align: center; margin-top: 24px;">
                <a href="https://frontend-lime-nine-60.vercel.app/admin" style="display: inline-block; background-color: #15803d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Review in Admin Panel →</a>
              </div>
            </div>
          `,
        }).catch((err) => console.error("Admin job alert email error:", err));
      }
    } catch (adminAlertError) {
      console.error("Error fetching admins for job notification:", adminAlertError);
    }
  }

  res.status(201).json(job);
});

// @desc  Public job search & listing with filters (excludes expired jobs)
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

  const now = new Date();
  const andConditions = [
    {
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gte: now } },
      ],
    },
    {
      $or: [
        { applicationDeadline: { $exists: false } },
        { applicationDeadline: null },
        { applicationDeadline: { $gte: now } },
      ],
    },
  ];

  if (keyword && keyword.trim()) {
    const keywordRegex = { $regex: keyword.trim(), $options: "i" };
    andConditions.push({
      $or: [
        { title: keywordRegex },
        { companyName: keywordRegex },
        { description: keywordRegex },
        { cropTags: keywordRegex },
        { requirements: keywordRegex },
        { responsibilities: keywordRegex },
      ],
    });
  }

  const query = {
    status: "approved",
    $and: andConditions,
  };

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

  if (fieldsToUpdate.applicationDeadline !== undefined || fieldsToUpdate.expiresAt !== undefined) {
    const rawDeadline = fieldsToUpdate.applicationDeadline ?? fieldsToUpdate.expiresAt;
    if (rawDeadline) {
      const d = new Date(rawDeadline);
      if (!isNaN(d.getTime())) {
        if (typeof rawDeadline === "string" && rawDeadline.length <= 10) {
          d.setUTCHours(23, 59, 59, 999);
        }
        fieldsToUpdate.applicationDeadline = d;
        fieldsToUpdate.expiresAt = d;
      }
    } else {
      fieldsToUpdate.applicationDeadline = null;
      fieldsToUpdate.expiresAt = null;
    }
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
