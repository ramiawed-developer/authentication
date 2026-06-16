import { getNumberEnv, getOptionalEnv } from "./get-env.js";

type AppEnvironment = "development" | "test" | "stage" | "production";

function getNodeEnv(): AppEnvironment {
  const value = process.env.NODE_ENV || "development";

  if (
    value === "development" ||
    value === "test" ||
    value === "stage" ||
    value === "production"
  ) {
    return value;
  }
  throw new Error(
    `Invalid NODE_ENV: ${value}. Expected development, test, stage, or production`,
  );
}

export const env = {
  nodeEnv: getNodeEnv(),
  port: getNumberEnv("PORT", 3001),
  frontendUrl: getOptionalEnv("FRONTEND_URL", "http://localhost:5173"),
  auth0: {
    domain: process.env.AUTH0_DOMAIN || "",
    audience: process.env.AUTH0_AUDIENCE || "",
  },
  database: {
    url: process.env.DATABASE_URL || "",
  },
} as const;
