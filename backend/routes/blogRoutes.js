import express from "express";
import Blog from "../models/Blog.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────

// GET /api/blogs — list published blogs (paginated)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const tag = req.query.tag || "";

    const filter = { isPublished: true };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }
    if (tag) {
      filter.tags = { $regex: tag, $options: "i" };
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-content"),
      Blog.countDocuments(filter),
    ]);

    res.json({
      blogs,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs", error: err.message });
  }
});

// GET /api/blogs/:slug — single blog by slug
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog", error: err.message });
  }
});

// ─── Admin Routes ─────────────────────────────────────────

// GET /api/blogs/admin/all — list ALL blogs (including drafts)
router.get("/admin/all", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs", error: err.message });
  }
});

// POST /api/blogs — create blog
router.post("/", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: "Failed to create blog", error: err.message });
  }
});

// PUT /api/blogs/:id — update blog
router.put("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: "Failed to update blog", error: err.message });
  }
});

// DELETE /api/blogs/:id — delete blog
router.delete("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete blog", error: err.message });
  }
});

export default router;
