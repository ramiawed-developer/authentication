import { authenticatedApiClient } from "../authenticatedClient";
import { MeResponseSchema } from "@authentication/contracts";
import type { MeResponse } from "@authentication/contracts";

export async function getMe(accessToken: string): Promise<MeResponse> {
  const data = await authenticatedApiClient<unknown>({
    path: "/api/me",
    accessToken,
  });

  return MeResponseSchema.parse(data);
}
