import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../models/Job.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const jobs = await Job.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }] });
    console.log(`Found ${jobs.length} jobs without a slug.`);

    let count = 0;
    for (const job of jobs) {
      const company = (job.companyName || "").trim();
      const loc = (job.location || "").trim();
      const parts = [job.title, company, loc].filter(Boolean).join(" ");
      let base = parts
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim() || "job";

      const suffix = job._id.toString().slice(-5);
      job.slug = `${base}-${suffix}`;
      await job.save();
      count++;
      console.log(`[${count}/${jobs.length}] Updated: ${job.slug}`);
    }

    console.log(`\n✅ Successfully generated slugs for all ${count} existing jobs!`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

run();
