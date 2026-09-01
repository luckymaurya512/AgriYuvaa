import express from "express";
import asyncHandler from "express-async-handler";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import SeekerProfile from "../models/SeekerProfile.js";

const router = express.Router();

// Helper to get or create a seeker profile
const getOrCreateProfile = async (userId) => {
  let profile = await SeekerProfile.findOne({ user: userId });
  if (!profile) {
    profile = await SeekerProfile.create({ user: userId, savedJobs: [] });
  }
  return profile;
};

// @route GET /api/users/seeker/me
router.get(
  "/seeker/me",
  authenticate,
  authorize("seeker"),
  asyncHandler(async (req, res) => {
    let profile = await SeekerProfile.findOne({ user: req.user._id }).populate({
      path: "savedJobs",
      populate: { path: "employer", select: "name" },
    });

    if (!profile) {
      profile = await SeekerProfile.create({ user: req.user._id, savedJobs: [] });
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

export default router;
