import { authenticatedApiClient } from "../authenticatedClient";

export type PrivateMessageResponse = {
  message: string;
};

export function getPrivateMessage(accessToken: string): Promise<PrivateMessageResponse> {
  return authenticatedApiClient<PrivateMessageResponse>({
    path: "/api/private",
    accessToken,
  });
}
