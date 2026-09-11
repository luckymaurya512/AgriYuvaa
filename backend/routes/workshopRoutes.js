import express from "express";
import Workshop from "../models/Workshop.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────

// GET /api/workshops — list active workshops
router.get("/", async (req, res) => {
  try {
    const filter = { isActive: true };
    const category = req.query.category || "";
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    const workshops = await Workshop.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workshops", error: err.message });
  }
});

// GET /api/workshops/:slug — single workshop
router.get("/:slug", async (req, res) => {
  try {
    const workshop = await Workshop.findOne({ slug: req.params.slug, isActive: true });
    if (!workshop) return res.status(404).json({ message: "Workshop not found" });
    res.json(workshop);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workshop", error: err.message });
  }
});

// ─── Admin Routes ─────────────────────────────────────────

// GET /api/workshops/admin/all — list ALL workshops
router.get("/admin/all", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const workshops = await Workshop.find().sort({ order: 1, createdAt: -1 });
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workshops", error: err.message });
  }
});

// POST /api/workshops — create
router.post("/", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json(workshop);
  } catch (err) {
    res.status(400).json({ message: "Failed to create workshop", error: err.message });
  }
});

// PUT /api/workshops/:id — update
router.put("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!workshop) return res.status(404).json({ message: "Workshop not found" });
    res.json(workshop);
  } catch (err) {
    res.status(400).json({ message: "Failed to update workshop", error: err.message });
  }
});

// DELETE /api/workshops/:id — delete
router.delete("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) return res.status(404).json({ message: "Workshop not found" });
    res.json({ message: "Workshop deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete workshop", error: err.message });
  }
});

export default router;
