import { describe, it, expect } from "vitest";
import { extractAuthenticatedUserProfile } from "../../src/middleware/auth/index.js";

describe("extractAuthenticatedUpserProfile", () => {
  it("extracts profile from request auth payload", () => {
    const req = {
      auth: {
        payload: {
          sub: "auth0|123",
          email: "user@example.com",
          name: "user",
          picture: "https://example.com/user.png",
        },
      },
    };

    const profile = extractAuthenticatedUserProfile(req as unknown as Request);

    expect(profile).toEqual({
      auth0Id: "auth0|123",
      email: "user@example.com",
      name: "user",
      picture: "https://example.com/user.png",
    });
  });

  it("uses null for missing optional profile claims", () => {
    const req = {
      auth: {
        payload: {
          sub: "auth0|123",
        },
      },
    };

    const profile = extractAuthenticatedUserProfile(req as unknown as Request);

    expect(profile).toEqual({
      auth0Id: "auth0|123",
      email: null,
      name: null,
      picture: null,
    });
  });

  it("throws when subject claim is missing", () => {
    const req = {
      auth: {
        payload: {},
      },
    };

    expect(() => extractAuthenticatedUserProfile(req as never)).toThrow(
      "Authenticated request is missing Auth0 subject claim"
    );
  });
});
