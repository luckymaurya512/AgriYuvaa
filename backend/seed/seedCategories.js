import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import mongoose from "mongoose";

dotenv.config();

const categories = [
  { name: "Farming & Crop Production", slug: "farming-crop-production", icon: "wheat" },
  { name: "Livestock & Dairy", slug: "livestock-dairy", icon: "cow" },
  { name: "Agri-Tech & Engineering", slug: "agri-tech-engineering", icon: "cpu" },
  { name: "Food Processing", slug: "food-processing", icon: "factory" },
  { name: "Horticulture", slug: "horticulture", icon: "flower" },
  { name: "Forestry", slug: "forestry", icon: "tree" },
  { name: "Agri-Business & Sales", slug: "agri-business-sales", icon: "briefcase" },
  { name: "Government / NGO Agri Jobs", slug: "government-ngo-agri-jobs", icon: "landmark" },
];

const run = async () => {
  await connectDB();

  for (const c of categories) {
    await Category.updateOne({ slug: c.slug }, { $set: c }, { upsert: true });
  }
  console.log(`Seeded ${categories.length} categories`);

  const superAdminEmail = process.env.SUPERADMIN_EMAIL;
  if (superAdminEmail) {
    const existing = await User.findOne({ email: superAdminEmail });
    if (!existing) {
      await User.create({
        name: process.env.SUPERADMIN_NAME || "Super Admin",
        email: superAdminEmail,
        passwordHash: process.env.SUPERADMIN_PASSWORD || "ChangeMe123!",
        role: "superadmin",
      });
      console.log(`Super admin created: ${superAdminEmail}`);
    } else {
      console.log("Super admin already exists, skipping");
    }
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
