import { authenticatedApiClient } from "../authenticatedClient";
import type { MeResponse } from "./me.types";

export function getMe(accessToken: string): Promise<MeResponse> {
  return authenticatedApiClient<MeResponse>({
    path: "/api/me",
    accessToken,
  });
}
