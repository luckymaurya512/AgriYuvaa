import express from "express";
import Testimonial from "../models/Testimonial.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────

// GET /api/testimonials — list active testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch testimonials", error: err.message });
  }
});

// ─── Admin Routes ─────────────────────────────────────────

// GET /api/testimonials/admin/all — list ALL testimonials
router.get("/admin/all", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch testimonials", error: err.message });
  }
});

// POST /api/testimonials — create
router.post("/", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(400).json({ message: "Failed to create testimonial", error: err.message });
  }
});

// PUT /api/testimonials/:id — update
router.put("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json(testimonial);
  } catch (err) {
    res.status(400).json({ message: "Failed to update testimonial", error: err.message });
  }
});

// DELETE /api/testimonials/:id — delete
router.delete("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json({ message: "Testimonial deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete testimonial", error: err.message });
  }
});

export default router;
