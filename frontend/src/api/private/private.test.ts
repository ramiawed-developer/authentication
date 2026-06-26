import { afterEach, describe, expect, it, vi } from "vitest";
import { getPrivateMessage } from "./private";

describe("getPrivateMessage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the protected private endpoint with an access token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "This is a protected endpoint. You have a valid access token.",
        }),
      })
    );

    const result = await getPrivateMessage("test-access-token");

    expect(result).toEqual({
      message: "This is a protected endpoint. You have a valid access token.",
    });
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
});
