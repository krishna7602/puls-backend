import { getIO } from "../socket/index.js";

export const attachIO = (req, res, next) => {
  req.io = getIO();
  next();
};
