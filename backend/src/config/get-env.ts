export function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export function getNumberEnv(key: string, defaultValue: number): number {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }

  return numberValue;
}
