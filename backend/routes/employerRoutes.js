import express from "express";
import {
  getEmployers,
  getEmployerById,
  getMyEmployerProfile,
  updateMyEmployerProfile,
} from "../controllers/employerController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getEmployers);
router.get("/me", authenticate, authorize("employer"), getMyEmployerProfile);
router.patch("/me", authenticate, authorize("employer"), updateMyEmployerProfile);
router.get("/:id", getEmployerById);

export default router;
