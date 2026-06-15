import { afterEach, describe, expect, it } from "vitest";
import { getEnv } from "../../src/config/get-env";

describe("getEnv", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns the environment value when it exists", () => {
    process.env = {
      ...originalEnv,
      TEST_KEY: "hello",
    };

    expect(getEnv("TEST_KEY")).toBe("hello");
  });

  it("returns default value when env value is missing", () => {
    expect(getEnv("TEST_KEY", "default-value")).toBe("default-value");
  });

  it("thows an error when value is missing and no default is provided", () => {
    expect(() => getEnv("MISSING_KEY")).toThrow(
      "Missing required environment variable: MISSING_KEY",
    );
  });
});
