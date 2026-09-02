import express from "express";
import asyncHandler from "express-async-handler";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import SeekerProfile from "../models/SeekerProfile.js";
import EmployerProfile from "../models/EmployerProfile.js";
import { upload, uploadFileToCloud } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Helper to get or create a seeker profile
const getOrCreateProfile = async (userId) => {
  let profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) {
    profile = await SeekerProfile.create({ user: userId, savedJobs: [], followedEmployers: [] });
  }
  return profile;
};

// @route GET /api/users/seeker/me
router.get(
  "/seeker/me",
  authenticate,
  authorize("seeker"),
  asyncHandler(async (req, res) => {
    let profile = await SeekerProfile.findOne({ user: req.user._id })
      .populate({
        path: "savedJobs",
        populate: { path: "employer", select: "name" },
      })
      .populate("followedEmployers", "companyName sector location logo user");

    if (!profile) {
      profile = await SeekerProfile.create({ user: req.user._id, savedJobs: [], followedEmployers: [] });
    }

    res.json(profile);
  })
);

// @route PATCH /api/users/seeker/me
router.patch(
  "/seeker/me",
  authenticate,
  authorize("seeker"),
  asyncHandler(async (req, res) => {
    const profile = await getOrCreateProfile(req.user._id);
    Object.assign(profile, req.body);
    await profile.save();
    res.json(profile);
  })
);

// @route POST /api/users/seeker/me/toggle-save-job/:jobId
// Toggles bookmark status (saves if unsaved, removes if already saved)
router.post(
  "/seeker/me/toggle-save-job/:jobId",
  authenticate,
  authorize("seeker"),
  asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const profile = await getOrCreateProfile(req.user._id);

    const stringIds = profile.savedJobs.map((id) => id.toString());
    const isSaved = stringIds.includes(jobId);

    if (isSaved) {
      profile.savedJobs = profile.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      profile.savedJobs.push(jobId);
    }

    await profile.save();

    const updatedProfile = await SeekerProfile.findById(profile._id).populate({
      path: "savedJobs",
      populate: { path: "employer", select: "name" },
    });

    res.json({
      savedJobs: updatedProfile.savedJobs,
      isSaved: !isSaved,
    });
  })
);

// @route POST /api/users/seeker/me/save-job/:jobId (backward compatibility)
router.post(
  "/seeker/me/save-job/:jobId",
  authenticate,
  authorize("seeker"),
  asyncHandler(async (req, res) => {
    const profile = await getOrCreateProfile(req.user._id);
    if (!profile.savedJobs.map(id => id.toString()).includes(req.params.jobId)) {
      profile.savedJobs.push(req.params.jobId);
      await profile.save();
    }
    res.json(profile);
  })
);

// @route POST /api/users/seeker/me/resume
router.post(
  "/seeker/me/resume",
  authenticate,
  authorize("seeker"),
  asyncHandler(async (req, res) => {
    const profile = await getOrCreateProfile(req.user._id);
    profile.resumeData = req.body;
    await profile.save();
    res.json({ message: "Resume saved successfully", resumeData: profile.resumeData });
  })
);

// @route POST /api/users/seeker/me/toggle-follow-employer/:employerId
router.post(
  "/seeker/me/toggle-follow-employer/:employerId",
  authenticate,
  authorize("seeker"),
  asyncHandler(async (req, res) => {
    const { employerId } = req.params;
    const profile = await getOrCreateProfile(req.user._id);

    // Resolve whether employerId is an EmployerProfile _id or User _id
    let employerProfile = await EmployerProfile.findById(employerId);
    if (!employerProfile) {
      employerProfile = await EmployerProfile.findOne({ user: employerId });
    }

    const targetProfileId = employerProfile ? employerProfile._id.toString() : employerId.toString();
    const targetUserId = employerProfile?.user?.toString();

    if (!profile.followedEmployers) profile.followedEmployers = [];

    const isFollowing = profile.followedEmployers.some((id) => {
      const idStr = (id._id || id).toString();
      return idStr === targetProfileId || (targetUserId && idStr === targetUserId);
    });

    if (isFollowing) {
      profile.followedEmployers = profile.followedEmployers.filter((id) => {
        const idStr = (id._id || id).toString();
        return idStr !== targetProfileId && idStr !== targetUserId && idStr !== employerId.toString();
      });
    } else {
      profile.followedEmployers.push(targetProfileId);
    }

    await profile.save();

    const updatedProfile = await SeekerProfile.findById(profile._id).populate(
      "followedEmployers",
      "companyName sector location logo user"
    );

    res.json({
      followedEmployers: updatedProfile.followedEmployers,
      isFollowing: !isFollowing,
    });
  })
);

// @route POST /api/users/seeker/me/push-subscription
router.post(
  "/seeker/me/push-subscription",
  authenticate,
  authorize("seeker"),
  asyncHandler(async (req, res) => {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint) {
      res.status(400);
      throw new Error("Invalid push subscription");
    }

    const profile = await getOrCreateProfile(req.user._id);
    if (!profile.pushSubscriptions) profile.pushSubscriptions = [];

    // Filter out existing duplicate endpoint if present
    profile.pushSubscriptions = profile.pushSubscriptions.filter(
      (sub) => sub.endpoint !== subscription.endpoint
    );
    profile.pushSubscriptions.push(subscription);

    await profile.save();
    res.json({ message: "Push notification subscription saved successfully" });
  })
);

// @route POST /api/users/seeker/upload-resume
router.post(
  "/seeker/upload-resume",
  authenticate,
  authorize("seeker"),
  upload.single("resume"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("Please select a resume file (PDF, DOCX, DOC, or Image) to upload");
    }

    const fileUrl = await uploadFileToCloud(req.file.buffer, req.file.originalname, "agriyuvaa/resumes");
    const profile = await getOrCreateProfile(req.user._id);
    profile.resumeUrl = fileUrl;
    await profile.save();

    res.json({
      url: fileUrl,
      filename: req.file.originalname,
      message: "Resume uploaded successfully",
    });
  })
);

export default router;
