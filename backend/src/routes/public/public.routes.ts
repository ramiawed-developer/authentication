import { Router } from "express";

export const publicRouter = Router();

publicRouter.get("/", (_req, res) => {
  res.status(200).json({
    message: "This is a public endpoint. No access token required",
  });
});
