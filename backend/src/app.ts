import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.routes";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTENT_URL ?? "http://localhost:5173",
    }),
  );

  app.use(express.json());
  app.use("/api/health", healthRouter);
  return app;
}
