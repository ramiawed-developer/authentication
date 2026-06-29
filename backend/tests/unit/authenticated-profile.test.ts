import { describe, expect, it } from "vitest";
import { extractAuthenticatedUserProfile } from "../../src/middleware/auth/index.js";

describe("extractAuthenticatedUserProfile", () => {
  it("extracts profile from request auth payload", () => {
    const req = {
      auth: {
        payload: {
          sub: "auth0|123",
          email: "user@example.com",
          name: "Test User",
          picture: "https://example.com/avatar.png",
        },
      },
    };

    const profile = extractAuthenticatedUserProfile(req as never);

    expect(profile).toEqual({
      auth0Id: "auth0|123",
      email: "user@example.com",
      name: "Test User",
      picture: "https://example.com/avatar.png",
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

    const profile = extractAuthenticatedUserProfile(req as never);

    expect(profile).toEqual({
      auth0Id: "auth0|123",
      email: null,
      name: null,
      picture: null,
    });
  });

  it("uses null for non-string optional profile claims", () => {
    const req = {
      auth: {
        payload: {
          sub: "auth0|123",
          email: 123,
          name: {},
          picture: false,
        },
      },
    };

    const profile = extractAuthenticatedUserProfile(req as never);

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
      "Authenticated request is missing Auth0 subject claim."
    );
  });
});
