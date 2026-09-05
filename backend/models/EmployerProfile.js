import mongoose from "mongoose";

const employerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    sector: { type: String, trim: true },
    logoUrl: { type: String },
    description: { type: String },
    website: { type: String },
    location: { type: String },
    gstOrFpoId: { type: String },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    documents: [{ type: String }],
  },
  { timestamps: true }
);

const EmployerProfile = mongoose.model("EmployerProfile", employerProfileSchema);
export default EmployerProfile;
