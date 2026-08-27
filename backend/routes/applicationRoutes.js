import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/jobs/:jobId", authenticate, authorize("seeker"), applyToJob);
router.get("/mine", authenticate, authorize("seeker"), getMyApplications);
router.get("/jobs/:jobId", authenticate, authorize("employer", "admin", "superadmin"), getApplicationsForJob);
router.patch("/:id/status", authenticate, authorize("employer", "admin", "superadmin"), updateApplicationStatus);

export default router;
