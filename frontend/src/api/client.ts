import { env } from "../config/env";

type ApiClientOptions = {
  path: string;
  init?: RequestInit;
};

export async function apiClient<TResponse>({
  path,
  init,
}: ApiClientOptions): Promise<TResponse> {
  const url = `${env.apiBaseUrl}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}
