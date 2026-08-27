import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import EmployerProfile from "../models/EmployerProfile.js";
import SeekerProfile from "../models/SeekerProfile.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import sendEmail from "../utils/sendEmail.js";

// ─── helpers ────────────────────────────────────────────────────────────────

/** Generate a random 6-digit numeric OTP */
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

/** Hash an OTP using bcrypt so it is never stored in plaintext */
const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

/** Build the HTML email body for the OTP */
const otpEmailHtml = (name, otp) => `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
    <h2 style="color:#166534;margin-bottom:8px;">Welcome to AgriYuvaa 🌾</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your email verification code is:</p>
    <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px;background:#f0fdf4;border-radius:8px;color:#166534;">
      ${otp}
    </div>
    <p style="margin-top:16px;font-size:13px;color:#6b7280;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
    <p style="font-size:12px;color:#9ca3af;">If you did not create an AgriYuvaa account, you can safely ignore this email.</p>
  </div>
`;

// ─── Register ───────────────────────────────────────────────────────────────

// @desc  Register a new user (seeker or employer)
// @route POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, companyName } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  // Public self-registration is limited to seeker/employer.
  // Admin/superadmin accounts are created only via the admin panel or seed script.
  const allowedRoles = ["seeker", "employer"];
  const finalRole = allowedRoles.includes(role) ? role : "seeker";

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // Generate & hash OTP
  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);

  const user = await User.create({
    name,
    email,
    phone,
    passwordHash: password, // hashed automatically via pre-save hook
    role: finalRole,
    status: "pending_verification",
    isEmailVerified: false,
    emailOtp: hashedOtp,
    emailOtpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    emailOtpAttempts: 0,
  });

  // Store companyName temporarily so we can create the profile after verification
  // We pass it back in the response so the frontend can send it during verify-otp
  const pendingCompanyName = finalRole === "employer" ? (companyName || name) : undefined;

  // Send OTP email
  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your AgriYuvaa account",
      html: otpEmailHtml(user.name, otp),
    });
  } catch (emailError) {
    // Clean up the created user if email fails so they can retry
    await User.findByIdAndDelete(user._id);
    res.status(500);
    throw new Error("Failed to send verification email. Please try again.");
  }

  res.status(201).json({
    message: "OTP sent to your email. Please verify to complete registration.",
    userId: user._id,
    role: finalRole,
    companyName: pendingCompanyName,
  });
});

// ─── Verify OTP ─────────────────────────────────────────────────────────────

// @desc  Verify the 6-digit OTP sent to user's email
// @route POST /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { userId, otp, companyName } = req.body;

  if (!userId || !otp) {
    res.status(400);
    throw new Error("User ID and OTP are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  // Rate limit: max 5 attempts per OTP
  if (user.emailOtpAttempts >= 5) {
    res.status(429);
    throw new Error("Too many attempts. Please request a new OTP.");
  }

  // Check expiry
  if (!user.emailOtpExpires || user.emailOtpExpires < new Date()) {
    res.status(400);
    throw new Error("OTP has expired. Please request a new one.");
  }

  // Compare OTP
  const isMatch = await bcrypt.compare(otp, user.emailOtp);
  if (!isMatch) {
    user.emailOtpAttempts += 1;
    await user.save();
    res.status(400);
    throw new Error(`Invalid OTP. ${5 - user.emailOtpAttempts} attempt(s) remaining.`);
  }

  // OTP is correct — activate the account
  user.isEmailVerified = true;
  user.status = "active";
  user.emailOtp = undefined;
  user.emailOtpExpires = undefined;
  user.emailOtpAttempts = 0;
  await user.save();

  // Create the role-specific profile
  if (user.role === "employer") {
    const existingProfile = await EmployerProfile.findOne({ user: user._id });
    if (!existingProfile) {
      await EmployerProfile.create({
        user: user._id,
        companyName: companyName || user.name,
      });
    }
  } else {
    const existingProfile = await SeekerProfile.findOne({ user: user._id });
    if (!existingProfile) {
      await SeekerProfile.create({ user: user._id });
    }
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  });
});

// ─── Resend OTP ─────────────────────────────────────────────────────────────

// @desc  Resend a new OTP to the user's email
// @route POST /api/auth/resend-otp
export const resendOtp = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("User ID is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  // Rate limit: prevent resending within 60 seconds
  if (user.emailOtpExpires) {
    const timeSinceLastOtp = Date.now() - (user.emailOtpExpires.getTime() - 10 * 60 * 1000);
    if (timeSinceLastOtp < 60 * 1000) {
      res.status(429);
      throw new Error("Please wait before requesting a new OTP.");
    }
  }

  // Generate new OTP
  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);

  user.emailOtp = hashedOtp;
  user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  user.emailOtpAttempts = 0;
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Your new AgriYuvaa verification code",
    html: otpEmailHtml(user.name, otp),
  });

  res.json({ message: "A new OTP has been sent to your email." });
});

// ─── Login ──────────────────────────────────────────────────────────────────

// @desc  Login
// @route POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.status === "pending_verification") {
    res.status(403);
    throw new Error("Please verify your email before logging in. Check your inbox for the OTP.");
  }

  if (user.status === "suspended") {
    res.status(403);
    throw new Error("Account suspended. Contact support.");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  });
});

// ─── Refresh Token ──────────────────────────────────────────────────────────

// @desc  Refresh access token
// @route POST /api/auth/refresh
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) {
    res.status(401);
    throw new Error("Refresh token required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error("User no longer exists");
    }
    const accessToken = generateAccessToken(user._id);
    res.json({ accessToken });
  } catch (error) {
    res.status(401);
    throw new Error("Invalid or expired refresh token");
  }
});

// ─── Get Me ─────────────────────────────────────────────────────────────────

// @desc  Get logged-in user's own profile
// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
