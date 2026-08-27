import express from "express";
import {
  getPlatformStats,
  listUsers,
  updateUserStatus,
  createAdmin,
  getPendingEmployers,
  verifyEmployer,
  getPendingJobs,
  reviewJob,
  getAuditLogs,
} from "../controllers/adminController.js";
import { createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes below require admin or superadmin
router.use(authenticate, authorize("admin", "superadmin"));

router.get("/stats", getPlatformStats);
router.get("/users", listUsers);
router.patch("/users/:id/status", updateUserStatus);

router.get("/employers/pending", getPendingEmployers);
router.patch("/employers/:id/verify", verifyEmployer);

router.get("/jobs/pending", getPendingJobs);
router.patch("/jobs/:id/review", reviewJob);

router.post("/categories", createCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/audit-logs", getAuditLogs);

// Super Admin only
router.post("/admins", authorize("superadmin"), createAdmin);

export default router;
