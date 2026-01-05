import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import Video from "../models/video.js";

ffmpeg.setFfmpegPath(ffmpegPath);

const PROCESSED_DIR = "uploads/processed";

// ensure processed directory exists
if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

export const processVideo = async (videoId, io) => {
  const video = await Video.findById(videoId);
  if (!video) return;

  video.status = "processing";
  video.processingProgress = 0;
  await video.save();

  const outputPath = path.join(PROCESSED_DIR, video.filename);

  let lastSavedProgress = 0;

  ffmpeg(video.storagePath)
    .outputOptions("-preset veryfast")
    .on("progress", async ({ percent }) => {
      const progress = Math.min(Math.round(percent || 0), 100);

      // avoid excessive DB writes
      if (progress - lastSavedProgress >= 5) {
        lastSavedProgress = progress;

        await Video.updateOne(
          { _id: videoId },
          { processingProgress: progress }
        );

        io.to(`video-${videoId}`).emit("video-processing-progress", {
          videoId,
          progress
        });
      }
    })
    .on("end", async () => {
      const sensitivity =
        video.size > 50 * 1024 * 1024 ? "flagged" : "safe";

      await Video.updateOne(
        { _id: videoId },
        {
          status: "completed",
          sensitivity,
          processingProgress: 100
        }
      );

      io.to(`video-${videoId}`).emit("video-processing-complete", {
        videoId,
        status: "completed",
        sensitivity
      });
    })
    .on("error", async (err) => {
      await Video.updateOne(
        { _id: videoId },
        {
          status: "failed",
          errorMessage: err.message
        }
      );

      io.to(`video-${videoId}`).emit("video-processing-failed", {
        videoId,
        error: err.message
      });
    })
    .save(outputPath);
};
