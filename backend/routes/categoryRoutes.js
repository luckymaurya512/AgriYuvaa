import express from "express";
import { getCategories, createCustomCategory } from "../controllers/categoryController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/custom", protect, createCustomCategory);

export default router;
