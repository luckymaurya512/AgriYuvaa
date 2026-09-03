import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary if credentials exist
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Memory storage to process buffer directly
const storage = multer.memoryStorage();

// File filter: PDF, DOCX, DOC, Images (up to 10MB)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /pdf|doc|docx|png|jpg|jpeg/i;
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, PNG, and JPG files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

/**
 * Uploads a file buffer to Cloudinary (or falls back to local uploads folder)
 * Returns the public access URL of the uploaded resume/document.
 */
export const uploadFileToCloud = async (fileBuffer, originalname, folder = "agriyuvaa/resumes") => {
  // 1. If Cloudinary is configured, upload to Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          public_id: `${Date.now()}_${path.parse(originalname).name.replace(/[^a-zA-Z0-9]/g, "_")}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url || result.url);
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  // 2. Local disk storage fallback
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const safeFilename = `${Date.now()}_${originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(uploadDir, safeFilename);
  await fs.promises.writeFile(filePath, fileBuffer);

  const baseUrl = (process.env.SERVER_URL || "https://agriyuvaa.onrender.com").replace(/\/+$/, "");
  return `${baseUrl}/uploads/${safeFilename}`;
};
