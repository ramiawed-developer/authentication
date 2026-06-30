import { describe, it, expect, beforeEach, vi } from "vitest";
import { getMe } from "./index";

describe("getMe", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls /api/me with the access token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          user: {
            id: "user-id",
            auth0Id: "auth0|123",
            email: "user@example.com",
            name: "Test User",
            picture: null,
            role: "USER",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        }),
      })
    );

    const result = await getMe("auth0|123");

    expect(result.user).toEqual({
      id: "user-id",
      auth0Id: "auth0|123",
      email: "user@example.com",
      name: "Test User",
      picture: null,
      role: "USER",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    expect(result.user.auth0Id).toBe("auth0|123");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/me",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer auth0|123",
        }),
      })
    );
  });

  it("throws when /api/me returns an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      })
    );

    await expect(getMe("bad-token")).rejects.toThrow(
      "Authenticated API request failed with status 401"
    );
  });
});
