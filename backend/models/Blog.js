import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    excerpt: {
      type: String,
      maxlength: 500,
    },
    coverImage: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "AgriYuvaa Team",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    targetSite: {
      type: String,
      enum: ["both", "landing", "jobs"],
      default: "both",
      index: true,
    },
    coverImageData: {
      type: String, // Base64 backup
      default: "",
    },
    coverImageMimeType: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title if not provided
blogSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  // Auto-generate excerpt from content if not provided
  if (this.content && !this.excerpt) {
    this.excerpt = this.content.replace(/<[^>]*>/g, "").substring(0, 200) + "...";
  }
  // Set publishedAt when publishing
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
