import fs from "fs";
import path from "path";
import Video from "../models/video.js";
import { processVideo } from "../services/videoProcessor.js";



/**
 * Upload Video
 * Multer injects file into req.file
 * Role: editor, admin
 */

export const uploadVideo = async (req, res) => {
  const video = await Video.create({
    organization: req.user.organization,
    uploadedBy: req.user.id,
    originalName: req.file.originalname,
    filename: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    storagePath: req.file.path,
    status: "uploaded"
  });

  // 🔥 EMIT upload event
  req.io.emit("video-uploaded", {
    videoId: video._id,
    status: "uploaded"
  });

  // Start background processing
  processVideo(video._id, req.io);

  res.status(201).json({
    success: true,
    message: "Video uploaded & processing started",
    data: video
  });
};



export const listVideos = async (req, res) => {
  try {
    const { status, sensitivity } = req.query;

    const filter = {
      organization: req.user.organization
    };

    if (status) filter.status = status;
    if (sensitivity) filter.sensitivity = sensitivity;

    const videos = await Video.find(filter)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
      error: error.message
    });
  }
};

/**
 * Stream Video using HTTP Range Requests
 * Role: viewer, editor, admin
 */
export const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.sendStatus(404);

    const processedPath = `uploads/processed/${video.filename}`;
    const originalPath = video.storagePath;

    const videoPath = fs.existsSync(processedPath)
      ? processedPath
      : originalPath;

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) return res.status(416).send("Range header required");

    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + 1e6, fileSize - 1);

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4"
    });

    file.pipe(res);
  } catch (err) {
    res.sendStatus(500);
  }
};

