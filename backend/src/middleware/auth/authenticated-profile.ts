import type { AuthenticatedUserProfile } from "../../modules/users/index.js";

type AuthPayload = {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
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
  const payload = authReq?.auth?.payload;

  const auth0Id = payload?.sub;

  if (!auth0Id) {
    throw new Error("Authenticated request is missing Auth0 subject claim");
  }

  return {
    auth0Id,
    email: getOptionalStringClaim(payload.email),
    name: getOptionalStringClaim(payload.name),
    picture: getOptionalStringClaim(payload.picture),
  };
}
