import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.routes.js";
import { env } from "./config/env.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.frontendUrl,
    }),
  );

  app.use(express.json());
  app.use("/api/health", healthRouter);
  return app;
}
