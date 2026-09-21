import mongoose from "mongoose";

const govtJobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Central Govt", "State Govt", "Banking & NABARD", "Research & ICAR", "PSU & Corporations"],
      default: "Central Govt",
    },
    state: { type: String, default: "All India" },
    qualification: {
      type: String,
      enum: ["B.Sc Agriculture", "M.Sc / Ph.D", "Diploma in Agriculture", "B.Tech Agri Engg", "Any Graduate"],
      default: "B.Sc Agriculture",
    },
    vacancies: { type: String, default: "Not Specified" },
    salary: { type: String, required: true },
    applicationDeadline: { type: String, required: true },
    notificationUrl: { type: String, default: "" },
    applyUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Closing Soon", "Upcoming"],
      default: "Active",
    },
    ageLimit: { type: String, default: "18 - 30 Years (Relaxation as per norms)" },
    description: { type: String, required: true },
    examDate: { type: String },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto-generate / normalize slug before validation
govtJobSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  } else if (this.slug) {
    this.slug = this.slug
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

const GovtJob = mongoose.model("GovtJob", govtJobSchema);
export default GovtJob;
