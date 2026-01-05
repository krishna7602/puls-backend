import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import videoRouter from "./routes/video.routes.js";

import { initSocket } from "./socket/index.js";
import { registerSocketEvents } from "./socket/events.js";
import { attachIO } from "./middleware/attachIO.js"; // ✅ fixed path

const app = express();
const server = http.createServer(app);

/* -------------------- CORS -------------------- */
app.use(
  cors({
    origin: ["http://localhost:5173","https://puls-frontend.vercel.app/"],
    credentials: true,
    exposedHeaders: ["Content-Range", "Accept-Ranges"]
  })
);

/* -------------------- Core Middlewares -------------------- */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

/* -------------------- Socket.io -------------------- */
const io = initSocket(server);
registerSocketEvents(io);

// attach io to req AFTER socket init
app.use(attachIO);

/* -------------------- Routes -------------------- */
app.use("/api/auth", authRouter);
app.use("/api/videos", videoRouter);


export { app };