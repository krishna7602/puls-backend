import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    originalName: String,
    filename: String,
    mimeType: String,
    size: Number,
    duration: Number, // seconds

    storagePath: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
      index: true
    },

    sensitivity: {
      type: String,
      enum: ["safe", "flagged", "unknown"],
      default: "unknown",
      index: true
    },

    processingProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    errorMessage: String
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
