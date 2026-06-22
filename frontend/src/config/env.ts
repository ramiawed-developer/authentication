type AppEnvironment = "development" | "test" | "stage" | "production";

function getAppEnv(): AppEnvironment {
  const value = import.meta.env.VITE_APP_ENV || "development";

  if (
    value === "development" ||
    value === "test" ||
    value === "stage" ||
    value === "production"
  ) {
    return value;
  }

  throw new Error(
    `Invalid VITE_APP_ENV: ${value}. Expected development, test, stage, or production.`,
  );
}

function getRequiredViteEnv(key: string): string {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing required frontend environment variable: ${key}`);
  }

  return value;
}

function getOptionalViteEnv(key: string, defaultValue: string): string {
  return import.meta.env[key] || defaultValue;
}

export const env = {
  appEnv: getAppEnv(),
  apiBaseUrl: getOptionalViteEnv("VITE_API_BASE_URL", "http://localhost:3001"),

  auth0: {
    domain: getRequiredViteEnv("VITE_AUTH0_DOMAIN"),
    clientId: getRequiredViteEnv("VITE_AUTH0_CLIENT_ID"),
    audience: getRequiredViteEnv("VITE_AUTH0_AUDIENCE"),
  },
} as const;
