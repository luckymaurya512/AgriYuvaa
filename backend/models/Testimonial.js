import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      default: "Agriculture Student",
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Testimonial content is required"],
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
