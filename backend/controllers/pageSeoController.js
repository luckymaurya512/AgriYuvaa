import asyncHandler from "express-async-handler";
import PageSeo from "../models/PageSeo.js";

// Default platform routes directory so admins have a turnkey catalog out-of-the-box
export const DEFAULT_PAGE_ROUTES = [
  {
    route: "/",
    pageName: "Home / Platform Gateway",
    defaultTitle: "AgriYuvaa — Premier Agriculture Jobs & Career Network in India",
    defaultDescription: "Explore thousands of verified agriculture jobs, agritech openings, government vacancies, and career insights across India on AgriYuvaa.",
    defaultKeywords: ["agriculture jobs", "agritech careers", "icar vacancies", "agronomy jobs india", "agriyuvaa"],
  },
  {
    route: "/jobs",
    pageName: "Job Search & Openings",
    defaultTitle: "Latest Agriculture Jobs & Vacancies in India 2026 | AgriYuvaa",
    defaultDescription: "Search and apply for high-paying agronomy, seed technology, horticulture, dairy, farm management, and agritech jobs across India.",
    defaultKeywords: ["agriculture vacancies 2026", "agri jobs", "bsc agriculture jobs", "agritech hiring"],
  },
  {
    route: "/govt-jobs",
    pageName: "Government Vacancies Portal",
    defaultTitle: "Government Agriculture Jobs 2026 | ICAR, NABARD, FCI, State Sarkari Naukri",
    defaultDescription: "Latest official government agriculture vacancy notices, exam dates, eligibility, and direct apply links for ICAR, FCI, NABARD, NSC, and State Dept of Agriculture.",
    defaultKeywords: ["govt agriculture jobs", "icar exam", "nabard recruitment", "fci vacancies", "agriculture sarkari naukri"],
  },
  {
    route: "/employers",
    pageName: "Employers & Hiring Companies Directory",
    defaultTitle: "Top Agriculture Companies & Agritech Employers in India | AgriYuvaa",
    defaultDescription: "Discover top agribusiness firms, seed & fertilizer corporations, and high-growth agritech startups hiring agricultural graduates and specialists.",
    defaultKeywords: ["agritech companies hiring", "seed companies jobs", "agribusiness employers india"],
  },
  {
    route: "/resume-builder",
    pageName: "Free Agriculture Resume Builder",
    defaultTitle: "Free Agriculture Resume Builder & CV Maker | AgriYuvaa",
    defaultDescription: "Build a professional, ATS-friendly resume tailored for agriculture, agronomy, farm management, and agritech job applications in minutes.",
    defaultKeywords: ["agriculture resume maker", "agronomy cv builder", "ats resume for agriculture graduates"],
  },
  {
    route: "/employer/post-job",
    pageName: "Post a Job (Employer Portal)",
    defaultTitle: "Hire Top Agriculture & Agritech Talent | Post a Job on AgriYuvaa",
    defaultDescription: "Reach thousands of verified B.Sc/M.Sc agriculture graduates, field officers, and agritech specialists. Post a job alert in under 2 minutes.",
    defaultKeywords: ["hire agriculture graduates", "post agri job", "agritech hiring portal"],
  },
  {
    route: "/register",
    pageName: "Candidate Registration",
    defaultTitle: "Join AgriYuvaa — Sign Up for Free Agriculture Job Alerts",
    defaultDescription: "Create your free candidate account on AgriYuvaa. Upload your resume, apply with 1 click, and get personalized job notifications.",
    defaultKeywords: ["register agriyuvaa", "create agriculture job profile"],
  },
  {
    route: "/login",
    pageName: "Candidate & Employer Login",
    defaultTitle: "Login to AgriYuvaa — Access Your Career & Hiring Dashboard",
    defaultDescription: "Log in to your AgriYuvaa account to track job applications, browse candidate resumes, and manage company postings.",
    defaultKeywords: ["agriyuvaa login", "agriculture job portal login"],
  },
];

// @desc  Get all page SEO entries (merging configured entries with default catalog)
// @route GET /api/page-seo
export const getAllPageSeo = asyncHandler(async (req, res) => {
  const configs = await PageSeo.find({}).sort({ route: 1 });
  const configMap = new Map();
  configs.forEach((c) => configMap.set(c.route.toLowerCase(), c));

  // Merge default routes so frontend always has the full catalog
  const mergedList = DEFAULT_PAGE_ROUTES.map((item) => {
    const existing = configMap.get(item.route.toLowerCase());
    if (existing) {
      configMap.delete(item.route.toLowerCase());
      return {
        _id: existing._id,
        route: existing.route,
        pageName: existing.pageName || item.pageName,
        metaTitle: existing.metaTitle,
        metaDescription: existing.metaDescription,
        metaKeywords: existing.metaKeywords,
        ogImage: existing.ogImage,
        noindex: existing.noindex,
        updatedAt: existing.updatedAt,
        isCustomized: true,
        defaultTitle: item.defaultTitle,
        defaultDescription: item.defaultDescription,
        defaultKeywords: item.defaultKeywords,
      };
    }
    return {
      route: item.route,
      pageName: item.pageName,
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      ogImage: "",
      noindex: false,
      isCustomized: false,
      defaultTitle: item.defaultTitle,
      defaultDescription: item.defaultDescription,
      defaultKeywords: item.defaultKeywords,
    };
  });

  // Include any extra custom routes added by admin
  configMap.forEach((existing) => {
    mergedList.push({
      _id: existing._id,
      route: existing.route,
      pageName: existing.pageName,
      metaTitle: existing.metaTitle,
      metaDescription: existing.metaDescription,
      metaKeywords: existing.metaKeywords,
      ogImage: existing.ogImage,
      noindex: existing.noindex,
      updatedAt: existing.updatedAt,
      isCustomized: true,
      defaultTitle: "",
      defaultDescription: "",
      defaultKeywords: [],
    });
  });

  res.json(mergedList);
});

// @desc  Get single route SEO configuration
// @route GET /api/page-seo/by-route
export const getPageSeoByRoute = asyncHandler(async (req, res) => {
  const routeParam = (req.query.route || "").trim().toLowerCase();
  if (!routeParam) {
    return res.status(400).json({ message: "Route query parameter is required" });
  }

  const found = await PageSeo.findOne({ route: routeParam });
  if (found) {
    return res.json(found);
  }

  const defaultMatch = DEFAULT_PAGE_ROUTES.find((r) => r.route.toLowerCase() === routeParam);
  if (defaultMatch) {
    return res.json({
      route: defaultMatch.route,
      pageName: defaultMatch.pageName,
      metaTitle: defaultMatch.defaultTitle,
      metaDescription: defaultMatch.defaultDescription,
      metaKeywords: defaultMatch.defaultKeywords,
      ogImage: "",
      noindex: false,
      isDefault: true,
    });
  }

  res.status(404).json({ message: "No custom SEO rule configured for route" });
});

// @desc  Upsert (create or update) SEO configuration for a route
// @route POST /api/page-seo
export const upsertPageSeo = asyncHandler(async (req, res) => {
  const { route, pageName, metaTitle, metaDescription, metaKeywords, ogImage, noindex } = req.body;

  if (!route || !route.trim()) {
    res.status(400);
    throw new Error("Route is required (e.g. /jobs)");
  }

  const cleanRoute = route.trim().toLowerCase().startsWith("/") ? route.trim().toLowerCase() : `/${route.trim().toLowerCase()}`;

  let parsedKeywords = [];
  if (Array.isArray(metaKeywords)) {
    parsedKeywords = metaKeywords.map((k) => k.trim()).filter(Boolean);
  } else if (typeof metaKeywords === "string") {
    parsedKeywords = metaKeywords.split(",").map((k) => k.trim()).filter(Boolean);
  }

  const updated = await PageSeo.findOneAndUpdate(
    { route: cleanRoute },
    {
      route: cleanRoute,
      pageName: pageName?.trim() || cleanRoute,
      metaTitle: (metaTitle || "").trim(),
      metaDescription: (metaDescription || "").trim(),
      metaKeywords: parsedKeywords,
      ogImage: (ogImage || "").trim(),
      noindex: Boolean(noindex),
      updatedBy: req.user._id,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({
    message: `SEO settings for ${cleanRoute} saved successfully!`,
    data: updated,
  });
});

// @desc  Delete custom SEO config (reset back to default)
// @route DELETE /api/page-seo/:id
export const deletePageSeo = asyncHandler(async (req, res) => {
  const entry = await PageSeo.findById(req.params.id);
  if (!entry) {
    res.status(404);
    throw new Error("Page SEO configuration not found");
  }

  await entry.deleteOne();
  res.json({ message: `Reset SEO for ${entry.route} to default` });
});
