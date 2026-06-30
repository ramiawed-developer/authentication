import { describe, expect, it } from "vitest";
import { MeResponseSchema } from "./me.contract.js";

describe("MeResponseSchema", () => {
  it("validates a valid /api/me response", () => {
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

  it("allows nullable profile fields", () => {
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
      currentUser: {
        id: "user-id",
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid role", () => {
    const result = MeResponseSchema.safeParse({
      user: {
        id: "user-id",
        auth0Id: "auth0|123",
        email: "user@example.com",
        name: "Test User",
        picture: null,
        role: "SUPER_ADMIN",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });

    expect(result.success).toBe(false);
  });
});
