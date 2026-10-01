import express from "express";
import {
  getAllPageSeo,
  getPageSeoByRoute,
  upsertPageSeo,
  deletePageSeo,
} from "../controllers/pageSeoController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes for frontend and search engine bots
router.get("/", getAllPageSeo);
router.get("/by-route", getPageSeoByRoute);

// Admin & Super Admin management routes
router.post("/", authenticate, authorize("admin", "superadmin"), upsertPageSeo);
router.delete("/:id", authenticate, authorize("admin", "superadmin"), deletePageSeo);

export default router;
