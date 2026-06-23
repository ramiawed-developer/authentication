import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "./client";

describe("apiClient", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns JSON when the request succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ message: "success" }),
      })
    );

    const result = await apiClient<{ message: "success" }>({
      path: "/api/test",
    });

    expect(result).toEqual({ message: "success" });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("throws an error when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue({
        ok: false,
        status: 500,
      })
    );

    await expect(
      apiClient<{ message: string }>({
        path: "/api/test",
      })
    ).rejects.toThrow("API request failed with status 500");
  });
});
