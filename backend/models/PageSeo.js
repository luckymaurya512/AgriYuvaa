import mongoose from "mongoose";

const pageSeoSchema = new mongoose.Schema(
  {
    route: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    pageName: {
      type: String,
      required: true,
      trim: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 350,
      default: "",
    },
    metaKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
    ogImage: {
      type: String,
      trim: true,
      default: "",
    },
    noindex: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const PageSeo = mongoose.model("PageSeo", pageSeoSchema);
export default PageSeo;
