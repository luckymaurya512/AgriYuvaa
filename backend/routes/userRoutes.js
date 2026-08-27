import express from "express";
import asyncHandler from "express-async-handler";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import SeekerProfile from "../models/SeekerProfile.js";

const router = express.Router();

// @route GET /api/users/seeker/me
router.get(
  "/seeker/me",
  authenticate,
  authorize("seeker"),
  asyncHandler(async (req, res) => {
    const profile = await SeekerProfile.findOne({ user: req.user._id }).populate("savedJobs");
    res.json(profile);
  })
);

// @route PATCH /api/users/seeker/me
router.patch(
  "/seeker/me",
  authenticate,
  authorize("seeker"),
  asyncHandler(async (req, res) => {
    const profile = await SeekerProfile.findOne({ user: req.user._id });
    Object.assign(profile, req.body);
    await profile.save();
    res.json(profile);
  })
);

// @route POST /api/users/seeker/me/save-job/:jobId
router.post(
  "/seeker/me/save-job/:jobId",
  authenticate,
  authorize("seeker"),
  asyncHandler(async (req, res) => {
    const profile = await SeekerProfile.findOne({ user: req.user._id });
    if (!profile.savedJobs.includes(req.params.jobId)) {
      profile.savedJobs.push(req.params.jobId);
      await profile.save();
    }
    res.json(profile);
  })
);

export default router;
