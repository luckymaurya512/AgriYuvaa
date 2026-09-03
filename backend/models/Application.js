import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    seeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    resumeOriginalName: { type: String },
    resumeMimeType: { type: String },
    resumeFileData: { type: String }, // Base64 data for resilient download
    coverNote: { type: String },
    status: {
      type: String,
      enum: ["applied", "viewed", "shortlisted", "rejected", "hired"],
      default: "applied",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
