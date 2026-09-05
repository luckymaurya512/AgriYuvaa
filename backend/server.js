import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// ...rest of your existing imports

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import employerRoutes from "./routes/employerRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import govtJobRoutes from "./routes/govtJobRoutes.js";

import fs from "fs";
import path from "path";
import Application from "./models/Application.js";
import SeekerProfile from "./models/SeekerProfile.js";

dotenv.config();
connectDB();

const app = express();

// Custom bulletproof CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "https://frontend-lime-nine-60.vercel.app",
  ].filter(Boolean);

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Smart /uploads handler: serves from disk if present, falls back to MongoDB Base64 buffer if ephemeral Render storage was reset
app.get("/uploads/:filename", async (req, res, next) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  try {
    const filenameRegex = new RegExp(req.params.filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    
    let doc = await Application.findOne({
      $or: [
        { resumeUrl: filenameRegex },
        { resumeOriginalName: filenameRegex },
      ],
      resumeFileData: { $exists: true, $ne: null },
    });

    if (!doc) {
      doc = await SeekerProfile.findOne({
        $or: [
          { resumeUrl: filenameRegex },
          { resumeOriginalName: filenameRegex },
        ],
        resumeFileData: { $exists: true, $ne: null },
      });
    }

    if (doc && doc.resumeFileData) {
      const fileBuffer = Buffer.from(doc.resumeFileData, "base64");
      const isDocx = req.params.filename.endsWith(".docx");
      const isDoc = req.params.filename.endsWith(".doc");
      const mimeType = doc.resumeMimeType || (isDocx ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : isDoc ? "application/msword" : "application/pdf");
      
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Disposition", `inline; filename="${doc.resumeOriginalName || req.params.filename}"`);
      return res.send(fileBuffer);
    }
  } catch (err) {
    console.error("Failed to restore upload from database persistence:", err);
  }

  next();
});

app.use("/uploads", express.static("uploads"));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "AgriYuvaa API" }));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/govt-jobs", govtJobRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AgriYuvaa API running on port ${PORT}`));
