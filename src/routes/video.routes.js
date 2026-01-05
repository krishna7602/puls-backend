import express from "express";
import { uploadVideoMulter } from "../middleware/multer.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {
  uploadVideo,
  listVideos,
  streamVideo
} from "../controllers/video.controller.js";

const videoRouter = express.Router();

// Upload video
videoRouter.post(
  "/upload",
  authenticate,
  authorizeRoles("editor", "admin"),
  uploadVideoMulter.single("video"),
  uploadVideo
);

// List videos
videoRouter.get("/", authenticate, listVideos);

// Stream video
videoRouter.get("/:id/stream", authenticate, streamVideo);

export default videoRouter;
