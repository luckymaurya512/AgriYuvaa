import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} from "../controllers/jobController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/employer/mine", authenticate, authorize("employer"), getMyJobs);
router.get("/:id", getJobById);
router.post("/", authenticate, authorize("employer", "admin", "superadmin"), createJob);
router.patch("/:id", authenticate, authorize("employer", "admin", "superadmin"), updateJob);
router.delete("/:id", authenticate, authorize("employer", "admin", "superadmin"), deleteJob);

export default router;
