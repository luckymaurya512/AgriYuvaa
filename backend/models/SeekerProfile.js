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
    preferredCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    location: { type: String },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
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
