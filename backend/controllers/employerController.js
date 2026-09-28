import asyncHandler from "express-async-handler";
import EmployerProfile from "../models/EmployerProfile.js";
import Job from "../models/Job.js";

// @desc  Get all approved employers (public directory)
// @route GET /api/employers
export const getEmployers = asyncHandler(async (req, res) => {
  const employers = await EmployerProfile.find({ verificationStatus: "approved" }).populate(
    "user",
    "name"
  );

  // Discover and include any company names from approved jobs (e.g., posted by admin)
  const approvedJobs = await Job.find({ status: "approved" })
    .select("companyName location sector employer createdAt")
    .lean();

  const existingNames = new Set(
    employers.map((e) => (e.companyName || "").toLowerCase().trim()).filter(Boolean)
  );

  const newProfiles = [];
  for (const job of approvedJobs) {
    const rawName = (job.companyName || "").trim();
    if (!rawName) continue;
    const lower = rawName.toLowerCase();
    if (!existingNames.has(lower)) {
      existingNames.add(lower);
      try {
        const created = await EmployerProfile.create({
          companyName: rawName,
          location: job.location || "",
          sector: "Agriculture & Agribusiness",
          verificationStatus: "approved",
          user: job.employer || undefined,
        });
        newProfiles.push(created);
      } catch (err) {
        const found = await EmployerProfile.findOne({
          companyName: { $regex: `^${rawName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
        });
        if (found) newProfiles.push(found);
      }
    }
  }

  res.json([...employers, ...newProfiles]);
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
  await profile.save();
  res.json(profile);
});
