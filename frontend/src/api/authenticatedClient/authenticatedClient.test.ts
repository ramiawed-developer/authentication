import { afterEach, describe, expect, it, vi } from "vitest";
import { authenticatedApiClient } from "./authenticatedClient";

describe("authenticatedClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("return JSON when the request succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue({
        ok: true,
        json: async () => ({ message: "private data" }),
      })
    );

    const response = await authenticatedApiClient<{ message: string }>({
      path: "/api/private",
      accessToken: "test-access-token",
    });

    expect(response).toEqual({ message: "private data" });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/private",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: `Bearer test-access-token`,
        }),
      })
    );
  });

  it("throws an error when the authenticated request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      })
    );

    await expect(
      authenticatedApiClient<{ message: string }>({
        path: "/api/private",
        accessToken: "bad-token",
      })
    ).rejects.toThrow("Authenticated API request failed with status 401");
  });
});
