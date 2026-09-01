import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    cropTags: [{ type: String }],
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "seasonal", "daily-wage", "contract", "internship"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "any"],
      default: "any",
    },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    location: { type: String, required: true },
    farmSize: { type: String },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "closed", "expired"],
      default: "pending",
    },
    rejectionReason: { type: String },
    applyType: {
      type: String,
      enum: ["platform", "email", "external_link"],
      default: "platform",
    },
    companyName: { type: String, trim: true },
    applyEmail: { type: String, trim: true },
    applyEmailSubject: { type: String, trim: true },
    applyEmailInstructions: { type: String, trim: true },
    applyUrl: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    applicationDeadline: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", location: "text", cropTags: "text" });

const Job = mongoose.model("Job", jobSchema);
export default Job;
