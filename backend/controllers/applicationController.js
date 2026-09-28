import path from "path";
import fs from "fs";
import asyncHandler from "express-async-handler";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import SeekerProfile from "../models/SeekerProfile.js";
import EmployerProfile from "../models/EmployerProfile.js";
import sendEmail from "../utils/sendEmail.js";

// @desc  Apply to a job
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

  // Lookup profile to get stored resume file data if available
  let candidateProfile = await SeekerProfile.findOne({ user: req.user._id });
  if (!candidateProfile) {
    candidateProfile = await EmployerProfile.findOne({ user: req.user._id });
  }

  const application = await Application.create({
    job: job._id,
    seeker: req.user._id,
    resumeUrl: req.body.resumeUrl || candidateProfile?.resumeUrl || `${process.env.FRONTEND_URL || "https://job.agriyuvaa.com"}/resume-builder`,
    resumeOriginalName: candidateProfile?.resumeOriginalName,
    resumeMimeType: candidateProfile?.resumeMimeType,
    resumeFileData: candidateProfile?.resumeFileData,
    coverNote: req.body.coverNote,
  });

  res.status(201).json(application);
});

// @desc  Download / view application resume safely
// @route GET /api/applications/:id/resume
export const downloadApplicationResume = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate("job");
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  // 1. If stored in MongoDB as base64Data
  if (application.resumeFileData) {
    const fileBuffer = Buffer.from(application.resumeFileData, "base64");
    const mimeType = application.resumeMimeType || "application/pdf";
    const filename = (application.resumeOriginalName || `Resume_${application._id}.pdf`).replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    return res.send(fileBuffer);
  }

  // If application has no resumeFileData, try fallback to seekerProfile
  const seekerProfile = await SeekerProfile.findOne({ user: application.seeker });
  if (seekerProfile?.resumeFileData) {
    const fileBuffer = Buffer.from(seekerProfile.resumeFileData, "base64");
    const mimeType = seekerProfile.resumeMimeType || "application/pdf";
    const filename = (seekerProfile.resumeOriginalName || `Resume_${application._id}.pdf`).replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    return res.send(fileBuffer);
  }

  // 2. If stored on disk in uploads
  if (application.resumeUrl) {
    let cleanUrl = application.resumeUrl.trim();
    if (cleanUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), cleanUrl);
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
    }

    // Clean up corrupted triple slashes if present (e.g. https:///uploads/...)
    cleanUrl = cleanUrl.replace(/^https?:\/\/\/+/, "/").replace(/^https?:\/\//i, "https://");
    if (cleanUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), cleanUrl);
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
      return res.redirect(`https://agriyuvaa.onrender.com${cleanUrl}`);
    }

    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }
    return res.redirect(cleanUrl);
  }

  res.status(404).json({ message: "Resume document not available" });
});

// @desc  Get applications submitted by the logged-in seeker
// @route GET /api/applications/mine
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ seeker: req.user._id })
    .populate({
      path: "job",
      select: "title location employer companyName isFeatured isUrgent",
      populate: { path: "employer", select: "name" },
    })
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

  // Enrich with seeker profile details (current CTC, expected CTC, notice period, organization)
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

// @desc  Update an application's status (shortlist / reject / hire) & notify candidate
// @route PATCH /api/applications/:id/status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["applied", "viewed", "shortlisted", "rejected", "hired"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const application = await Application.findById(req.params.id)
    .populate("job")
    .populate("seeker", "name email");

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  const isPrivileged = ["admin", "superadmin"].includes(req.user?.role);
  const employerId = application.job?.employer?._id
    ? application.job.employer._id.toString()
    : application.job?.employer?.toString();
  const isOwner = employerId && employerId === req.user._id.toString();

  if (!isOwner && !isPrivileged) {
    res.status(403);
    throw new Error("You do not have permission to update this application");
  }

  const previousStatus = application.status;
  application.status = status;
  await application.save();

  // Send email notification to candidate on status update (shortlisted, hired, rejected)
  if (previousStatus !== status && ["shortlisted", "hired", "rejected"].includes(status)) {
    const candidateEmail = application.seeker?.email;
    const candidateName = application.seeker?.name || "Applicant";
    const jobTitle = application.job?.title || "Agriculture Position";
    const company = application.job?.companyName || "Hiring Employer";

    if (candidateEmail) {
      const statusTitle =
        status === "shortlisted"
          ? "🎉 Congratulations! You have been Shortlisted"
          : status === "hired"
          ? "🏆 Congratulations! You have been Selected"
          : "Update regarding your job application";

      const statusBadgeColor =
        status === "shortlisted" ? "#15803d" : status === "hired" ? "#047857" : "#dc2626";

      const messageBody =
        status === "shortlisted"
          ? `Great news! Your profile has been <strong>shortlisted</strong> for the <strong>${jobTitle}</strong> role by <strong>${company}</strong>. The employer team will contact you soon for the next steps.`
          : status === "hired"
          ? `Congratulations! <strong>${company}</strong> has selected you for the position of <strong>${jobTitle}</strong>. We wish you immense success in your new journey!`
          : `Thank you for taking the time to apply for <strong>${jobTitle}</strong> at <strong>${company}</strong>. While they have decided to move forward with other candidates at this time, we encourage you to keep exploring exciting agriculture opportunities on AgriYuvaa.`;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #15803d; margin: 0; font-size: 22px;">AgriYuvaa Careers</h2>
            <p style="color: #6b7280; font-size: 13px; margin-top: 4px;">Empowering Youth in Agriculture</p>
          </div>
          
          <div style="padding: 18px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid ${statusBadgeColor};">
            <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 16px;">${statusTitle}</h3>
            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">Dear ${candidateName},</p>
            <p style="margin: 12px 0 0 0; color: #374151; font-size: 14px; line-height: 1.5;">${messageBody}</p>
          </div>

          <div style="text-align: center; margin: 28px 0 12px 0;">
            <a href="${process.env.CLIENT_URL || "https://job.agriyuvaa.com"}/seeker" style="display: inline-block; background-color: #15803d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">View Application Dashboard</a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">© ${new Date().getFullYear()} AgriYuvaa. All rights reserved.</p>
        </div>
      `;

      sendEmail({
        to: candidateEmail,
        subject: `[AgriYuvaa] Application Update: ${jobTitle} at ${company}`,
        html: emailHtml,
      }).catch((err) => console.error("Error sending status notification email:", err.message));
    }
  }

  res.json(application);
});
