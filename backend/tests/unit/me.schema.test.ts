import { describe, it, expect } from "vitest";
import { MeResponseSchema } from "../../src/routes/me/me.schema.js";
describe("MeResponseSchema", () => {
  it("validate a valid /api/me response", () => {
    const result = MeResponseSchema.safeParse({
      user: {
        id: "user-id",
        auth0Id: "auth0|123",
        email: "user@example.com",
        name: "Test User",
        picture: "https://example.com/avatar.png",
        role: "USER",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });

    expect(result.success).toBe(true);
  });

  it("validate nullable optional profile fields", () => {
    const result = MeResponseSchema.safeParse({
      user: {
        id: "user-id",
        auth0Id: "auth0|123",
        email: null,
        name: null,
        picture: null,
        role: "USER",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid response shape", () => {
    const result = MeResponseSchema.safeParse({
      user: {
        id: "user-id",
      },
    });

    expect(result.success).toBe(false);
  });
});
