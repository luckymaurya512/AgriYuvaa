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
    // Dedicated SEO Metadata
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    metaKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
    canonicalUrl: {
      type: String,
      trim: true,
      default: "",
    },
    ogImage: {
      type: String,
      trim: true,
      default: "",
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
  // Auto-generate metaTitle from title if not set
  if (this.title && !this.metaTitle) {
    this.metaTitle = this.title.substring(0, 100);
  }
  // Auto-generate metaDescription from excerpt or content if not set
  if (!this.metaDescription) {
    if (this.excerpt) {
      this.metaDescription = this.excerpt.substring(0, 160);
    } else if (this.content) {
      this.metaDescription = this.content.replace(/<[^>]*>/g, "").substring(0, 160);
    }
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
