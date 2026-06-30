import { authenticatedApiClient } from "../authenticatedClient";
import { MeResponseSchema } from "./me.schema";
import type { MeResponse } from "./me.schema";

export async function getMe(accessToken: string): Promise<MeResponse> {
  const data = await authenticatedApiClient<unknown>({
    path: "/api/me",
    accessToken,
  });

  return MeResponseSchema.parse(data);
}
