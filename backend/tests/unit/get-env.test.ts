import { afterEach, describe, expect, it } from "vitest";
import {
  getNumberEnv,
  getOptionalEnv,
  getRequiredEnv,
} from "../../src/config/get-env.js";

describe("environment phelps", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it("getRequiredEnv returns the environment value when it exists", () => {
    process.env = {
      ...originalEnv,
      TEST_KEY: "hello",
    };

    expect(getRequiredEnv("TEST_KEY")).toBe("hello");
  });

  it("getRequiredEnv throw when value is missing", () => {
    expect(() => getRequiredEnv("TEST_KEY")).toThrow(
      `Missing required environment variable: TEST_KEY`,
    );
  });

  it("getOptionalEnv returns default value when env value is missing", () => {
    expect(getOptionalEnv("TEST_KEY", "default-value")).toBe("default-value");
  });

  it("getNumberEnv returns default number when env value is missing", () => {
    expect(getNumberEnv("TEST_KEY", 10)).toBe(10);
  });

  it("getNumberEnv parse number values", () => {
    process.env = {
      ...originalEnv,
      TEST_KEY: "4000",
    };
    expect(getNumberEnv("TEST_KEY", 10)).toBe(4000);
  });

  it("getNumberEvn throws when env value is not a number", () => {
    process.env = {
      ...originalEnv,
      TEST_KEY: "hello",
    };

    expect(() => getNumberEnv("TEST_KEY", 4000)).toThrow(
      `Environment variable TEST_KEY must be a number`,
    );
  });
});
