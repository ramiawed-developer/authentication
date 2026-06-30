import type { Request } from "express";
import type { AuthenticatedUserProfile } from "../../modules/users/index.js";

type AuthPayload = {
  sub?: string;
  email?: unknown;
  name?: unknown;
  picture?: unknown;
};

type RequestWithAuth = Request & {
  auth?: {
    payload?: AuthPayload;
  };
};

function getOptionalStringClaim(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function extractAuthenticatedUserProfile(req: Request): AuthenticatedUserProfile {
  const authReq = req as RequestWithAuth;
  const payload = authReq.auth?.payload;

  const auth0Id = payload?.sub;

  if (!auth0Id) {
    throw new Error("Authenticated request is missing Auth0 subject claim.");
  }

  /**
   * Access tokens always need a stable subject claim for identity.
   * Profile claims such as email, name, and picture are optional because
   * API access tokens do not always include OIDC profile data.
   *
   * Future profile enrichment options:
   * - use Auth0 /userinfo with openid profile email scopes
   * - copy selected ID token profile fields from frontend to backend
   * - add custom namespaced claims through Auth0 Actions
   */

  return {
    auth0Id,
    email: getOptionalStringClaim(payload.email),
    name: getOptionalStringClaim(payload.name),
    picture: getOptionalStringClaim(payload.picture),
  };
}
