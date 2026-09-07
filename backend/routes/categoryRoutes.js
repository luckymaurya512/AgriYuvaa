import express from "express";
import { getCategories, createCustomCategory } from "../controllers/categoryController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/custom", authenticate, createCustomCategory);

export default router;
