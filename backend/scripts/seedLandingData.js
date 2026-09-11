/**
 * Seed Landing Page Data
 * Run: node backend/scripts/seedLandingData.js
 * Seeds testimonials and workshops from the existing WordPress content.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import Testimonial from "../models/Testimonial.js";
import Workshop from "../models/Workshop.js";
import Blog from "../models/Blog.js";

const MONGO_URI = process.env.MONGO_URI;

const testimonials = [
  {
    name: "Abhay",
    role: "Agriculture Student",
    content:
      "I am very happy to join the training that I have acquired knowledge about the drone technology. I want to know about more agriculture aspects as to keep training in your AYS.",
    rating: 5,
    avatarUrl: "",
    isActive: true,
    order: 1,
  },
  {
    name: "Deepanjali",
    role: "Agriculture Student",
    content:
      "The training of three days was good sir and I gained the knowledge about drone. I didn't have even 1% knowledge about this, so after attending the classes I learnt more about drones. Thank you sir for giving me this knowledge.",
    rating: 5,
    avatarUrl: "",
    isActive: true,
    order: 2,
  },
  {
    name: "Jitesh",
    role: "Agriculture Student",
    content:
      "The information you provided is truly remarkable and commendable. Thank you AgriYuvaa team.",
    rating: 5,
    avatarUrl: "",
    isActive: true,
    order: 3,
  },
];

const workshops = [
  {
    title: "Beekeeping Farming",
    slug: "beekeeping-farming",
    description:
      "Learn the art and science of beekeeping — from hive management to honey harvesting. A hands-on workshop designed for aspiring apiculturists.",
    category: "Farming",
    coverImage: "",
    instructor: "AgriYuvaa Expert",
    duration: "3 Days",
    price: 0,
    registrationUrl: "",
    isActive: true,
    order: 1,
  },
  {
    title: "Biofloc Fish Farming",
    slug: "biofloc-fish-farming",
    description:
      "Master biofloc technology for sustainable fish farming. Learn water management, feeding strategies, and tank setup for commercial-scale production.",
    category: "Aquaculture",
    coverImage: "",
    instructor: "AgriYuvaa Expert",
    duration: "3 Days",
    price: 0,
    registrationUrl: "",
    isActive: true,
    order: 2,
  },
  {
    title: "Drone Technology",
    slug: "drone-technology",
    description:
      "Get certified in agricultural drone operations. Learn drone assembly, flight operations, precision spraying, and crop monitoring techniques.",
    category: "AgriTech",
    coverImage: "",
    instructor: "AgriYuvaa Expert",
    duration: "3 Days",
    price: 0,
    registrationUrl: "",
    isActive: true,
    order: 3,
  },
  {
    title: "Hydroponics Technology",
    slug: "hydroponics-technology",
    description:
      "Explore soilless farming techniques. Learn to set up hydroponic systems, manage nutrient solutions, and grow high-value crops year-round.",
    category: "AgriTech",
    coverImage: "",
    instructor: "AgriYuvaa Expert",
    duration: "3 Days",
    price: 0,
    registrationUrl: "",
    isActive: true,
    order: 4,
  },
  {
    title: "Mushroom Farming",
    slug: "mushroom-farming",
    description:
      "Start your mushroom cultivation journey — from spawn preparation to harvesting and marketing. Ideal for low-investment, high-return farming.",
    category: "Farming",
    coverImage: "",
    instructor: "AgriYuvaa Expert",
    duration: "3 Days",
    price: 0,
    registrationUrl: "",
    isActive: true,
    order: 5,
  },
  {
    title: "Saffron Farming",
    slug: "saffron-farming",
    description:
      "Learn the cultivation techniques of the world's most expensive spice. Covers soil preparation, planting, harvesting, and post-harvest processing.",
    category: "Farming",
    coverImage: "",
    instructor: "AgriYuvaa Expert",
    duration: "3 Days",
    price: 0,
    registrationUrl: "",
    isActive: true,
    order: 6,
  },
  {
    title: "Precision Farming",
    slug: "precision-farming",
    description:
      "Use data-driven technology to optimize crop yields. Learn about GPS mapping, variable rate technology, IoT sensors, and smart irrigation systems.",
    category: "AgriTech",
    coverImage: "",
    instructor: "AgriYuvaa Expert",
    duration: "3 Days",
    price: 0,
    registrationUrl: "",
    isActive: true,
    order: 7,
  },
];

const sampleBlogs = [
  {
    title: "The Future of Agriculture: How Technology is Transforming Farming",
    slug: "future-of-agriculture-technology",
    content: `Agriculture is undergoing a massive transformation driven by technology. From AI-powered crop monitoring to drone-based spraying, the next generation of farmers is embracing innovation like never before.

Key technologies reshaping agriculture:
• Precision Agriculture using GPS and IoT sensors
• Drone Technology for crop spraying and monitoring  
• AI and Machine Learning for yield prediction
• Blockchain for supply chain transparency
• Vertical Farming and Hydroponics for urban food production

At AgriYuvaa, we believe the future belongs to tech-savvy agricultural professionals. Our workshops and training programs are designed to equip young farmers with these cutting-edge skills.

Join us in building a smarter, more sustainable agricultural future.`,
    excerpt:
      "Agriculture is undergoing a massive transformation driven by technology. From AI-powered crop monitoring to drone-based spraying, the next generation of farmers is embracing innovation.",
    coverImage: "",
    author: "AgriYuvaa Team",
    tags: ["AgriTech", "Innovation", "Farming"],
    isPublished: true,
    publishedAt: new Date("2025-03-15"),
  },
  {
    title: "5 High-Demand Agriculture Careers in 2025",
    slug: "high-demand-agriculture-careers-2025",
    content: `The agriculture sector is booming with career opportunities. Here are the top 5 agriculture careers that are in high demand:

1. Agricultural Drone Pilot
With precision agriculture on the rise, certified drone pilots are needed for crop spraying, mapping, and surveillance operations.

2. Food Technologist
Food processing companies are constantly seeking professionals who understand food science, preservation, and quality control.

3. Agri-Business Consultant
Farmers and agri-companies need consultants who can advise on market trends, supply chain optimization, and government schemes.

4. Soil Scientist
With soil health becoming a critical concern, soil scientists are needed for analysis, remediation, and sustainable farming practices.

5. Farm Manager
Modern farms need professional managers who can handle operations, labor management, and financial planning.

At AgriYuvaa, we connect talented agriculture professionals with the right opportunities. Create your profile today!`,
    excerpt:
      "The agriculture sector is booming with career opportunities. Discover the top 5 agriculture careers that are in high demand in 2025.",
    coverImage: "",
    author: "AgriYuvaa Team",
    tags: ["Careers", "Agriculture", "Jobs"],
    isPublished: true,
    publishedAt: new Date("2025-04-02"),
  },
  {
    title: "Why Youth are the Future of Indian Agriculture",
    slug: "youth-future-indian-agriculture",
    content: `India's agriculture sector contributes 18% to the GDP and employs over 42% of the workforce. Yet, the average age of Indian farmers is increasing, and fewer young people are choosing farming as a career.

This is where AgriYuvaa comes in. We are on a mission to change this narrative by:

• Creating awareness about modern agriculture careers
• Providing skill development through workshops and training
• Connecting young talent with agriculture employers
• Building a community of agricultural youth leaders

The future of Indian agriculture depends on empowering the next generation with knowledge, skills, and opportunities. Together, we can build a more productive, sustainable, and profitable agricultural sector.

Join the AgriYuvaa movement today!`,
    excerpt:
      "India's agriculture sector employs over 42% of the workforce. Discover why youth empowerment is key to transforming Indian agriculture.",
    coverImage: "",
    author: "AgriYuvaa Team",
    tags: ["Youth", "India", "Agriculture"],
    isPublished: true,
    publishedAt: new Date("2025-05-10"),
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Seed Testimonials
    const existingTestimonials = await Testimonial.countDocuments();
    if (existingTestimonials === 0) {
      await Testimonial.insertMany(testimonials);
      console.log(`✅ Seeded ${testimonials.length} testimonials`);
    } else {
      console.log(`⏭️  Testimonials already exist (${existingTestimonials}), skipping`);
    }

    // Seed Workshops
    const existingWorkshops = await Workshop.countDocuments();
    if (existingWorkshops === 0) {
      await Workshop.insertMany(workshops);
      console.log(`✅ Seeded ${workshops.length} workshops`);
    } else {
      console.log(`⏭️  Workshops already exist (${existingWorkshops}), skipping`);
    }

    // Seed Blogs
    const existingBlogs = await Blog.countDocuments();
    if (existingBlogs === 0) {
      await Blog.insertMany(sampleBlogs);
      console.log(`✅ Seeded ${sampleBlogs.length} blogs`);
    } else {
      console.log(`⏭️  Blogs already exist (${existingBlogs}), skipping`);
    }

    console.log("\n🎉 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
