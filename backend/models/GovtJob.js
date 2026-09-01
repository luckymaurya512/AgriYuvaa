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
    vacancies: { type: String, required: true },
    salary: { type: String, required: true },
    applicationDeadline: { type: String, required: true },
    notificationUrl: { type: String, required: true },
    applyUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Closing Soon", "Upcoming"],
      default: "Active",
    },
    ageLimit: { type: String, default: "18 - 30 Years (Relaxation as per norms)" },
    description: { type: String, required: true },
    examDate: { type: String },
  },
  { timestamps: true }
);

const GovtJob = mongoose.model("GovtJob", govtJobSchema);
export default GovtJob;
