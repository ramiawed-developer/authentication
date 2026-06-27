import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.routes.js";
import { env } from "./config/env.js";
import { publicRouter } from "./routes/public/public.routes.js";
import { privateRouter } from "./routes/private/private.routes.js";
import { requireAuth } from "./middleware/auth/require-auth.js";
import { databaseRouter } from "./routes/database/database.routes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.frontendUrl,
    })
  );

  app.use(express.json());
  app.use("/api/health", healthRouter);
  app.use("/api/public", publicRouter);
  app.use("/api/private", requireAuth, privateRouter);
  app.use("/api/database", databaseRouter);
  return app;
}
