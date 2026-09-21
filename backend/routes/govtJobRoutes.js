import express from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import GovtJob from "../models/GovtJob.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

const slugify = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const initialGovtJobsSeed = [
  {
    title: "Agriculture Field Officer (AFO Scale-I) - CRP SPL XIV",
    slug: "ibps-afo-scale-1-crp-spl-xiv",
    organization: "Institute of Banking Personnel Selection (IBPS)",
    category: "Banking & NABARD",
    state: "All India",
    qualification: "B.Sc Agriculture",
    vacancies: "896 Posts",
    salary: "₹48,480 - ₹85,920 / month + Allowances",
    applicationDeadline: "31 Oct 2026",
    notificationUrl: "https://www.ibps.in",
    applyUrl: "https://ibpsonline.ibps.in",
    status: "Active",
    ageLimit: "20 - 30 Years",
    description:
      "Recruitment of Specialist Officers in Participating Public Sector Banks. Responsible for rural credit appraisal, crop loan disbursement, and farmer financial schemes.",
    examDate: "Prelims: Dec 2026 | Mains: Jan 2027",
  },
  {
    title: "Assistant Agriculture Officer (AAO) & ADO Examination",
    slug: "uppsc-aao-ado-agriculture-officer",
    organization: "State Public Service Commission / Dept of Agriculture",
    category: "State Govt",
    state: "Uttar Pradesh & MP",
    qualification: "B.Sc Agriculture",
    vacancies: "420 Posts",
    salary: "Pay Level-7 (₹44,900 - ₹1,42,400)",
    applicationDeadline: "15 Nov 2026",
    notificationUrl: "https://uppsc.up.nic.in",
    applyUrl: "https://uppsc.up.nic.in",
    status: "Active",
    ageLimit: "21 - 40 Years",
    description:
      "Direct recruitment for Agriculture Development Officers across district subdivisions for government subsidy distribution, extension, and soil testing.",
    examDate: "Dec 2026",
  },
  {
    title: "NABARD Grade 'A' Assistant Manager (RDBS - Agriculture)",
    slug: "nabard-grade-a-assistant-manager-rdbs",
    organization: "National Bank for Agriculture and Rural Development",
    category: "Banking & NABARD",
    state: "All India",
    qualification: "B.Sc Agriculture",
    vacancies: "150 Posts",
    salary: "Gross Emoluments ~ ₹1,00,000 / month",
    applicationDeadline: "25 Oct 2026",
    notificationUrl: "https://www.nabard.org/careers",
    applyUrl: "https://www.nabard.org",
    status: "Closing Soon",
    ageLimit: "21 - 30 Years",
    description:
      "Prestigious rural banking officer vacancy. Involves formulation of district credit plans, farm infrastructure financing, and rural cooperative monitoring.",
    examDate: "Phase 1: Nov 2026",
  },
  {
    title: "Senior Research Fellow (SRF) & Young Professional-II",
    slug: "icar-iari-srf-young-professional",
    organization: "ICAR - Indian Agricultural Research Institute (IARI), New Delhi",
    category: "Research & ICAR",
    state: "New Delhi",
    qualification: "M.Sc / Ph.D",
    vacancies: "38 Posts",
    salary: "₹42,000 + HRA / month",
    applicationDeadline: "10 Nov 2026",
    notificationUrl: "https://www.iari.res.in",
    applyUrl: "https://www.iari.res.in/index.php/en/announcements/vacancies",
    status: "Active",
    ageLimit: "35 Years (Men) / 40 Years (Women)",
    description:
      "Research positions under ICAR-funded climate resilient crop breeding and precision nitrogen management projects.",
    examDate: "Walk-in Interview / Online Test",
  },
  {
    title: "Subject Matter Specialist (Agronomy / Horticulture / Plant Protection)",
    slug: "kvk-icar-subject-matter-specialist",
    organization: "Krishi Vigyan Kendra (KVK) / State Agri University",
    category: "Central Govt",
    state: "Punjab & Haryana",
    qualification: "M.Sc / Ph.D",
    vacancies: "64 Posts",
    salary: "Pay Matrix Level-10 (₹56,100 - ₹1,77,500)",
    applicationDeadline: "20 Nov 2026",
    notificationUrl: "https://icar.org.in",
    applyUrl: "https://icar.org.in",
    status: "Active",
    ageLimit: "Up to 35 Years",
    description:
      "Frontline extension scientist roles conducting on-farm trials (OFT), frontline demonstrations (FLD), and farmer training on modern agri practices.",
    examDate: "Screening Test: Dec 2026",
  },
  {
    title: "Management Trainee (Technical) & Assistant Grade-III (Agri)",
    slug: "fci-management-trainee-technical-agri",
    organization: "Food Corporation of India (FCI)",
    category: "PSU & Corporations",
    state: "All India",
    qualification: "B.Sc Agriculture",
    vacancies: "512 Posts",
    salary: "₹40,000 - ₹1,40,000 / month",
    applicationDeadline: "05 Dec 2026",
    notificationUrl: "https://www.fci.gov.in",
    applyUrl: "https://www.fci.gov.in/recruitment",
    status: "Upcoming",
    ageLimit: "18 - 28 Years",
    description:
      "Grain procurement, quality inspection, moisture analysis, and warehouse pest control management across FCI procurement centres.",
    examDate: "Jan 2027",
  },
];

// @route GET /api/govt-jobs
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Auto-seed if empty
    const count = await GovtJob.countDocuments();
    if (count === 0) {
      await GovtJob.insertMany(initialGovtJobsSeed);
    } else {
      // Backfill missing slugs for existing records if any
      const unslugged = await GovtJob.find({
        $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
      });
      for (const item of unslugged) {
        let baseSlug = slugify(item.title);
        let candidateSlug = baseSlug;
        let counter = 1;
        while (await GovtJob.findOne({ slug: candidateSlug, _id: { $ne: item._id } })) {
          candidateSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        item.slug = candidateSlug;
        await item.save();
      }
    }

    const { category, qualification, status, search } = req.query;
    const filter = {};

    if (category && category !== "All") filter.category = category;
    if (qualification && qualification !== "All") filter.qualification = qualification;
    if (status && status !== "All") filter.status = status;
    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [{ title: regex }, { organization: regex }, { state: regex }, { description: regex }];
    }

    const jobs = await GovtJob.find(filter).sort("-createdAt");
    res.json(jobs);
  })
);

// @route GET /api/govt-jobs/:idOrSlug
router.get(
  "/:idOrSlug",
  asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    let job = null;

    // First try lookup by slug
    job = await GovtJob.findOne({ slug: idOrSlug.toLowerCase() });

    // Fallback lookup by ObjectId
    if (!job && mongoose.Types.ObjectId.isValid(idOrSlug)) {
      job = await GovtJob.findById(idOrSlug);
    }

    if (!job) {
      res.status(404);
      throw new Error("Government job vacancy not found");
    }
    res.json(job);
  })
);

// @route POST /api/govt-jobs (Admin / Super Admin)
router.post(
  "/",
  authenticate,
  authorize("admin", "superadmin"),
  asyncHandler(async (req, res) => {
    let { slug, title, ...rest } = req.body;
    let baseSlug = slugify(slug || title);
    if (!baseSlug) baseSlug = "govt-vacancy";

    // Ensure unique slug
    let candidateSlug = baseSlug;
    let counter = 1;
    while (await GovtJob.findOne({ slug: candidateSlug })) {
      candidateSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const job = await GovtJob.create({
      ...rest,
      title,
      slug: candidateSlug,
    });
    res.status(201).json(job);
  })
);

// @route PUT /api/govt-jobs/:id (Admin / Super Admin)
router.put(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  asyncHandler(async (req, res) => {
    const job = await GovtJob.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error("Government job vacancy not found");
    }

    let { slug, title } = req.body;
    if (slug) {
      const formattedSlug = slugify(slug);
      const existing = await GovtJob.findOne({
        slug: formattedSlug,
        _id: { $ne: job._id },
      });
      if (existing) {
        res.status(400);
        throw new Error("Slug is already in use by another government vacancy");
      }
      job.slug = formattedSlug;
    } else if (title && !job.slug) {
      job.slug = slugify(title);
    }

    // Assign all fields
    const allowedFields = [
      "title",
      "organization",
      "category",
      "state",
      "qualification",
      "vacancies",
      "salary",
      "applicationDeadline",
      "notificationUrl",
      "applyUrl",
      "status",
      "ageLimit",
      "description",
      "examDate",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    const updatedJob = await job.save();
    res.json(updatedJob);
  })
);

// @route DELETE /api/govt-jobs/:id (Admin / Super Admin)
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),
  asyncHandler(async (req, res) => {
    await GovtJob.findByIdAndDelete(req.params.id);
    res.json({ message: "Government job notification removed" });
  })
);

export default router;
