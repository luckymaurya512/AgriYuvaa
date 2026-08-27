import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import EmployerProfile from "../models/EmployerProfile.js";
import Category from "../models/Category.js";
import Job from "../models/Job.js";

dotenv.config();

const DEMO_EMPLOYER_EMAIL = "demo.employer@agriyuvaa.com";
const DEMO_EMPLOYER_PASSWORD = "DemoEmployer123!";

const sampleJobs = [
  {
    title: "Farm Supervisor - Wheat & Mustard",
    description:
      "Oversee daily farm operations across 200 acres of wheat and mustard cultivation, manage a team of 15 field workers, and coordinate irrigation and harvest schedules.",
    responsibilities: [
      "Supervise sowing, irrigation, and harvest cycles",
      "Manage and train field labor team",
      "Maintain records of yield and input usage",
    ],
    requirements: ["Diploma or degree in Agriculture", "2+ years farm supervision experience"],
    benefits: ["On-site housing", "Meals provided", "Annual bonus"],
    categorySlug: "farming-crop-production",
    cropTags: ["wheat", "mustard"],
    employmentType: "full-time",
    experienceLevel: "mid",
    salaryMin: 18000,
    salaryMax: 25000,
    location: "Hoshiarpur, Punjab",
  },
  {
    title: "Dairy Farm Technician",
    description:
      "Support day-to-day operations at a 150-cattle dairy unit including feeding schedules, milking operations, and basic animal health monitoring.",
    responsibilities: ["Assist with milking and feeding schedules", "Monitor cattle health and report issues"],
    requirements: ["ITI or diploma in Dairy/Animal Husbandry", "Willingness to work early shifts"],
    benefits: ["Housing on campus", "Health insurance"],
    categorySlug: "livestock-dairy",
    cropTags: ["dairy"],
    employmentType: "full-time",
    experienceLevel: "entry",
    salaryMin: 14000,
    salaryMax: 18000,
    location: "Anand, Gujarat",
  },
  {
    title: "Agri-Tech Field Engineer (Drone Operations)",
    description:
      "Operate and maintain agricultural drones for crop spraying and field mapping, and train local farmers on precision-agriculture tools.",
    responsibilities: ["Operate spraying/mapping drones", "Train farmer clients on the app and hardware"],
    requirements: ["B.Tech/Diploma in Agri Engineering or related field", "Drone pilot certification a plus"],
    benefits: ["Travel allowance", "Performance incentives"],
    categorySlug: "agri-tech-engineering",
    cropTags: ["precision-agriculture"],
    employmentType: "full-time",
    experienceLevel: "entry",
    salaryMin: 22000,
    salaryMax: 32000,
    location: "Nashik, Maharashtra",
  },
  {
    title: "Quality Control Executive - Food Processing",
    description:
      "Ensure quality standards across incoming raw produce and outgoing packaged food products at our processing unit.",
    responsibilities: ["Conduct quality checks per SOP", "Maintain compliance documentation"],
    requirements: ["B.Sc in Food Technology or related field"],
    benefits: ["PF & ESI", "Cafeteria on-site"],
    categorySlug: "food-processing",
    cropTags: [],
    employmentType: "full-time",
    experienceLevel: "entry",
    salaryMin: 20000,
    salaryMax: 28000,
    location: "Ludhiana, Punjab",
  },
  {
    title: "Horticulture Intern - Greenhouse Operations",
    description:
      "3-month internship supporting greenhouse cultivation of exotic vegetables, with mentorship from senior horticulturists.",
    responsibilities: ["Assist with planting, irrigation, and pest management", "Log growth data daily"],
    requirements: ["Currently pursuing or recently completed a degree in Horticulture"],
    benefits: ["Stipend provided", "Certificate on completion"],
    categorySlug: "horticulture",
    cropTags: ["greenhouse"],
    employmentType: "internship",
    experienceLevel: "entry",
    salaryMin: 8000,
    salaryMax: 10000,
    location: "Bengaluru, Karnataka",
  },
  {
    title: "Agri-Business Sales Executive",
    description:
      "Drive sales of seeds, fertilizers, and farm equipment across a rural district territory, building relationships with FPOs and individual farmers.",
    responsibilities: ["Meet monthly sales targets", "Build and maintain dealer network"],
    requirements: ["Graduate in any discipline", "Two-wheeler and valid license required"],
    benefits: ["Fuel allowance", "Sales incentives"],
    categorySlug: "agri-business-sales",
    cropTags: [],
    employmentType: "full-time",
    experienceLevel: "any",
    salaryMin: 15000,
    salaryMax: 22000,
    location: "Indore, Madhya Pradesh",
  },
];

const run = async () => {
  await connectDB();

  // 1. Create (or reuse) a demo employer user + profile, pre-approved
  let employerUser = await User.findOne({ email: DEMO_EMPLOYER_EMAIL });
  if (!employerUser) {
    employerUser = await User.create({
      name: "Demo Employer",
      email: DEMO_EMPLOYER_EMAIL,
      passwordHash: DEMO_EMPLOYER_PASSWORD,
      role: "employer",
    });
    console.log(`Created demo employer user: ${DEMO_EMPLOYER_EMAIL} / ${DEMO_EMPLOYER_PASSWORD}`);
  } else {
    console.log("Demo employer user already exists, reusing");
  }

  let employerProfile = await EmployerProfile.findOne({ user: employerUser._id });
  if (!employerProfile) {
    employerProfile = await EmployerProfile.create({
      user: employerUser._id,
      companyName: "AgriYuvaa Demo Farms Pvt Ltd",
      sector: "Mixed Agriculture",
      location: "India",
      verificationStatus: "approved", // pre-approved so jobs can go live immediately
    });
  } else if (employerProfile.verificationStatus !== "approved") {
    employerProfile.verificationStatus = "approved";
    await employerProfile.save();
  }

  // 2. Insert sample jobs, already approved, tied to real category IDs
  let createdCount = 0;
  for (const jobData of sampleJobs) {
    const category = await Category.findOne({ slug: jobData.categorySlug });
    if (!category) {
      console.warn(`Category not found for slug "${jobData.categorySlug}" — run "npm run seed" first. Skipping job "${jobData.title}".`);
      continue;
    }

    const exists = await Job.findOne({ title: jobData.title, employer: employerUser._id });
    if (exists) continue;

    const { categorySlug, ...rest } = jobData;
    await Job.create({
      ...rest,
      category: category._id,
      employer: employerUser._id,
      status: "approved",
      isFeatured: Math.random() > 0.5,
    });
    createdCount += 1;
  }

  console.log(`Seeded ${createdCount} sample jobs (already approved and visible on /jobs)`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
