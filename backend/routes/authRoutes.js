import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  getMe,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.get("/me", authenticate, getMe);

export default router;
