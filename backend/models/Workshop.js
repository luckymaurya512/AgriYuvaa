import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Workshop title is required"],
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
    description: {
      type: String,
      required: [true, "Workshop description is required"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    instructor: {
      type: String,
      default: "AgriYuvaa Expert",
    },
    duration: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    registrationUrl: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title if not provided
workshopSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

const Workshop = mongoose.model("Workshop", workshopSchema);
export default Workshop;
