import asyncHandler from "express-async-handler";
import EmployerProfile from "../models/EmployerProfile.js";

// @desc  Get all approved employers (public directory)
// @route GET /api/employers
export const getEmployers = asyncHandler(async (req, res) => {
  const employers = await EmployerProfile.find({ verificationStatus: "approved" }).populate(
    "user",
    "name"
  );
  res.json(employers);
});

// @desc  Get a single employer profile by id
// @route GET /api/employers/:id
export const getEmployerById = asyncHandler(async (req, res) => {
  const employer = await EmployerProfile.findById(req.params.id).populate("user", "name email");
  if (!employer) {
    res.status(404);
    throw new Error("Employer not found");
  }
  res.json(employer);
});

// @desc  Get / update the logged-in employer's own profile
// @route GET /api/employers/me
export const getMyEmployerProfile = asyncHandler(async (req, res) => {
  const profile = await EmployerProfile.findOne({ user: req.user._id });
  if (!profile) {
    res.status(404);
    throw new Error("Employer profile not found");
  }
  res.json(profile);
});

// @route PATCH /api/employers/me
export const updateMyEmployerProfile = asyncHandler(async (req, res) => {
  const profile = await EmployerProfile.findOne({ user: req.user._id });
  if (!profile) {
    res.status(404);
    throw new Error("Employer profile not found");
  }
  Object.assign(profile, req.body);
  // Editing key details re-triggers verification
  if (req.body.companyName || req.body.gstOrFpoId) {
    profile.verificationStatus = "pending";
  }
  await profile.save();
  res.json(profile);
});
