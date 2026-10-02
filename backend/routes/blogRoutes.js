import express from "express";
import Blog from "../models/Blog.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { upload, uploadFileToCloud } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────

// GET /api/blogs — list published blogs (paginated, with targetSite filter)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const tag = req.query.tag || "";
    const targetSite = req.query.targetSite || "";

    const andConditions = [{ isPublished: true }];

    if (targetSite === "landing") {
      andConditions.push({
        $or: [
          { targetSite: { $in: ["landing", "both"] } },
          { targetSite: { $exists: false } },
          { targetSite: null },
        ],
      });
    } else if (targetSite === "jobs") {
      andConditions.push({
        $or: [
          { targetSite: { $in: ["jobs", "both"] } },
          { targetSite: { $exists: false } },
          { targetSite: null },
        ],
      });
    }

    if (search) {
      andConditions.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { excerpt: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ],
      });
    }
    if (tag) {
      andConditions.push({ tags: { $regex: tag, $options: "i" } });
    }

    const filter = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

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

// Helper for safely escaping HTML in dynamic crawler previews
const escapeHtml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// GET /api/blogs/share/:slug — Social Crawler preview for WhatsApp, Facebook, LinkedIn, Instagram, Twitter
router.get("/share/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const isLanding = req.query.site === "landing";
    const siteName = isLanding ? "AgriYuvaa" : "AgriYuvaa Jobs";
    const defaultLogo = isLanding
      ? "https://agriyuvaa.com/logo.png"
      : "https://jobs.agriyuvaa.com/logo.png";
    const baseSiteUrl = isLanding
      ? "https://agriyuvaa.com"
      : "https://jobs.agriyuvaa.com";

    const blog = await Blog.findOne({ slug, isPublished: true });

    if (!blog) {
      return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(siteName)} — Agriculture Careers & Insights</title>
  <meta property="og:site_name" content="${escapeHtml(siteName)}">
  <meta property="og:title" content="${escapeHtml(siteName)}">
  <meta property="og:description" content="Explore agriculture career insights, jobs, and articles on AgriYuvaa.">
  <meta property="og:image" content="${defaultLogo}">
  <meta property="og:image:secure_url" content="${defaultLogo}">
  <meta property="og:image:type" content="image/png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${defaultLogo}">
</head>
<body>
  <script>window.location.replace("${baseSiteUrl}/blog");</script>
</body>
</html>`);
    }

    const title = blog.metaTitle || blog.title || siteName;
    const displayTitle = title.includes("AgriYuvaa") ? title : `${title} | ${siteName}`;

    let description = blog.metaDescription || blog.excerpt || "";
    if (!description && blog.content) {
      description = blog.content.replace(/<[^>]*>/g, "").substring(0, 160).trim();
    }
    if (!description) {
      description = "Read this article on AgriYuvaa — India's premier agriculture career and knowledge network.";
    }

    // Determine Image: Thumbnail/CoverImage first, else fallback to logo
    const rawImage = (blog.ogImage || blog.coverImage || "").trim();
    let finalImage = defaultLogo;

    if (rawImage && !rawImage.startsWith("data:")) {
      if (rawImage.startsWith("http://") || rawImage.startsWith("https://")) {
        finalImage = rawImage.replace(/^http:\/\//, "https://");
      } else if (rawImage.startsWith("/")) {
        finalImage = `${baseSiteUrl}${rawImage}`;
      } else {
        finalImage = `${baseSiteUrl}/${rawImage}`;
      }
    }

    const canonicalUrl = `${baseSiteUrl}/blog/${blog.slug}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(displayTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">

  <!-- Open Graph / WhatsApp / Facebook / Instagram / LinkedIn -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${escapeHtml(siteName)}">
  <meta property="og:title" content="${escapeHtml(displayTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${finalImage}">
  <meta property="og:image:secure_url" content="${finalImage}">
  <meta property="og:image:alt" content="${escapeHtml(blog.title)}">
  <meta property="og:locale" content="en_IN">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(displayTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${finalImage}">

  <link rel="canonical" href="${canonicalUrl}">
</head>
<body>
  <h1>${escapeHtml(blog.title)}</h1>
  <p>${escapeHtml(description)}</p>
  <img src="${finalImage}" alt="${escapeHtml(blog.title)}" />
  <script>window.location.replace("${canonicalUrl}");</script>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    return res.status(200).send(html);
  } catch (err) {
    res.status(500).send("Error rendering blog preview");
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

// POST /api/blogs/upload-image — upload a blog cover image
router.post(
  "/upload-image",
  authenticate,
  authorize("admin", "superadmin", "employer"),
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const fileUrl = await uploadFileToCloud(
        req.file.buffer,
        req.file.originalname,
        "agriyuvaa/blogs"
      );
      res.json({
        url: fileUrl,
        originalName: req.file.originalname,
        size: req.file.size,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to upload image", error: err.message });
    }
  }
);

export default router;
