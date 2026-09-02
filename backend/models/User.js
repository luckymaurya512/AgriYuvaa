import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "employer", "seeker"],
      default: "seeker",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending_verification"],
      default: "active",
    },
    isEmailVerified: { type: Boolean, default: false },
    emailOtp: { type: String },
    emailOtpExpires: { type: Date },
    emailOtpAttempts: { type: Number, default: 0 },
    resetPasswordOtp: { type: String },
    resetPasswordOtpExpires: { type: Date },
    resetPasswordOtpAttempts: { type: Number, default: 0 },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
