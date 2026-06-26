import { env } from "../../config/env";

type AuthenticatedApiClientOptions = {
  path: string;
  accessToken: string;
  init?: RequestInit;
};

export async function authenticatedApiClient<TResponse>({
  path,
  accessToken,
  init,
}: AuthenticatedApiClientOptions): Promise<TResponse> {
  const url = `${env.apiBaseUrl}${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Authenticated API request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}
