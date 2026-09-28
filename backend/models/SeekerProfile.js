import mongoose from "mongoose";

const seekerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    skills: [{ type: String }],
    experience: [
      {
        title: String,
        organization: String,
        from: Date,
        to: Date,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    resumeUrl: { type: String },
    resumeOriginalName: { type: String },
    resumeMimeType: { type: String },
    resumeFileData: { type: String },
    resumeUploadedAt: { type: Date },
    resumeBuilderUpdatedAt: { type: Date },
    resumeUpdatedAt: { type: Date },
    activeResumeType: { type: String, enum: ["upload", "builder"] },
    currentOrganization: { type: String, trim: true, default: "" },
    currentDesignation: { type: String, trim: true, default: "" },
    currentCtc: { type: String, trim: true, default: "" },
    expectedCtc: { type: String, trim: true, default: "" },
    noticePeriod: { type: String, trim: true, default: "" },
    totalExperience: { type: String, trim: true, default: "" },
    preferredJobType: { type: String, trim: true, default: "Full-time" },
    preferredLocations: { type: String, trim: true, default: "" },
    openToRelocate: { type: Boolean, default: true },
    highestQualification: { type: String, trim: true, default: "" },
    specialization: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    preferredCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    location: { type: String },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    followedEmployers: [{ type: mongoose.Schema.Types.ObjectId, ref: "EmployerProfile" }],
    pushSubscriptions: [{ type: mongoose.Schema.Types.Mixed }],
    resumeData: { type: mongoose.Schema.Types.Mixed },
    jobAlertPreferences: {
      categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
      locations: [{ type: String }],
      minSalary: { type: Number },
    },
  },
  { timestamps: true }
);

const SeekerProfile = mongoose.model("SeekerProfile", seekerProfileSchema);
export default SeekerProfile;
