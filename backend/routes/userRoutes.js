import express from "express";
import asyncHandler from "express-async-handler";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
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

// @route GET /api/users/profile
// Get unified profile for any logged in user
router.get(
  "/profile",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    let profileData = null;
    if (user.role === "seeker") {
      profileData = await SeekerProfile.findOne({ user: user._id })
        .populate("savedJobs", "title location employer isFeatured")
        .populate("followedEmployers", "companyName sector location logo user");
      if (!profileData) {
        profileData = await SeekerProfile.create({ user: user._id, savedJobs: [], followedEmployers: [] });
      }
    } else if (user.role === "employer") {
      profileData = await EmployerProfile.findOne({ user: user._id });
      if (!profileData) {
        profileData = await EmployerProfile.create({
          user: user._id,
          companyName: user.name,
        });
      }
    }

    res.json({
      user,
      profile: profileData,
    });
  })
);

// @route PATCH /api/users/profile
// Update unified user and profile information
router.patch(
  "/profile",
  authenticate,
  asyncHandler(async (req, res) => {
    const { name, phone, avatarUrl, seekerProfile, employerProfile } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    await user.save();

    let profileData = null;
    if (user.role === "seeker" && seekerProfile) {
      profileData = await SeekerProfile.findOne({ user: user._id });
      if (!profileData) {
        profileData = await SeekerProfile.create({ user: user._id, ...seekerProfile });
      } else {
        Object.assign(profileData, seekerProfile);
        await profileData.save();
      }
    } else if (user.role === "employer" && employerProfile) {
      profileData = await EmployerProfile.findOne({ user: user._id });
      if (!profileData) {
        profileData = await EmployerProfile.create({ user: user._id, ...employerProfile });
      } else {
        Object.assign(profileData, employerProfile);
        await profileData.save();
      }
    } else {
      if (user.role === "seeker") {
        profileData = await SeekerProfile.findOne({ user: user._id });
      } else if (user.role === "employer") {
        profileData = await EmployerProfile.findOne({ user: user._id });
      }
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified,
      },
      profile: profileData,
    });
  })
);

// @route PUT /api/users/change-password
// Change user password
router.put(
  "/change-password",
  authenticate,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Both current and new password are required");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters long");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }

    user.passwordHash = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  })
);

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

// @route POST /api/users/seeker/me/resume and /api/users/me/resume
router.post(
  ["/seeker/me/resume", "/me/resume"],
  authenticate,
  asyncHandler(async (req, res) => {
    const now = new Date();
    const resumeData = {
      ...(req.body || {}),
      updatedAt: req.body?.updatedAt || now.toISOString(),
    };

    if (req.user.role === "employer") {
      let empProfile = await EmployerProfile.findOne({ user: req.user._id });
      if (!empProfile) {
        empProfile = await EmployerProfile.create({ user: req.user._id, companyName: req.user.name });
      }
      empProfile.resumeData = resumeData;
      empProfile.resumeBuilderUpdatedAt = now;
      empProfile.resumeUpdatedAt = now;
      empProfile.activeResumeType = "builder";
      await empProfile.save();
      return res.json({ message: "Resume saved successfully", resumeData: empProfile.resumeData });
    }

    const profile = await getOrCreateProfile(req.user._id);
    profile.resumeData = resumeData;
    profile.resumeBuilderUpdatedAt = now;
    profile.resumeUpdatedAt = now;
    profile.activeResumeType = "builder";
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

// @route POST /api/users/seeker/upload-resume and /api/users/upload-resume
router.post(
  ["/seeker/upload-resume", "/upload-resume"],
  authenticate,
  upload.single("resume"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("Please select a resume file (PDF, DOCX, DOC, or Image) to upload");
    }

    const base64Data = req.file.buffer.toString("base64");
    const fileUrl = await uploadFileToCloud(req.file.buffer, req.file.originalname, "agriyuvaa/resumes");
    const now = new Date();

    if (req.user.role === "employer") {
      let empProfile = await EmployerProfile.findOne({ user: req.user._id });
      if (!empProfile) {
        empProfile = await EmployerProfile.create({ user: req.user._id, companyName: req.user.name });
      }
      empProfile.resumeUrl = fileUrl;
      empProfile.resumeOriginalName = req.file.originalname;
      empProfile.resumeMimeType = req.file.mimetype;
      empProfile.resumeFileData = base64Data;
      empProfile.resumeUploadedAt = now;
      empProfile.resumeUpdatedAt = now;
      empProfile.activeResumeType = "upload";
      await empProfile.save();
    } else {
      const profile = await getOrCreateProfile(req.user._id);
      profile.resumeUrl = fileUrl;
      profile.resumeOriginalName = req.file.originalname;
      profile.resumeMimeType = req.file.mimetype;
      profile.resumeFileData = base64Data;
      profile.resumeUploadedAt = now;
      profile.resumeUpdatedAt = now;
      profile.activeResumeType = "upload";
      await profile.save();
    }

    res.json({
      url: fileUrl,
      filename: req.file.originalname,
      message: "Resume uploaded successfully",
    });
  })
);

export default router;
