import { afterEach, describe, expect, it, vi } from "vitest";
import { mockUseAuth0 } from "../../test/mockAuth0";
import { render, screen } from "@testing-library/react";
import { ProtectedMessage } from "./ProtectedMessage";
import userEvent from "@testing-library/user-event";

describe("ProtectedMessage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing when the user is not authenticated", () => {
    mockUseAuth0({
      isAuthenticated: false,
    });

    const { container } = render(<ProtectedMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it("load protected backend data when authenticated", async () => {
    const { getAccessTokenSilently } = mockUseAuth0({
      isAuthenticated: true,
    });
    getAccessTokenSilently.mockResolvedValue("test-access-token");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          message: "This is a protected endpoint. You have a valid access token.",
        }),
      })
    );

    render(<ProtectedMessage />);

    await userEvent.click(screen.getByRole("button", { name: /load protected data/i }));

    expect(
      await screen.findByText(/This is a protected endpoint. You have a valid access token./i)
    ).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/private",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-access-token",
        }),
      })
    );
  });

  it("show an error when the protected request fails", async () => {
    const { getAccessTokenSilently } = mockUseAuth0({ isAuthenticated: true });

    getAccessTokenSilently.mockReturnValue("test-access-token");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue({
        ok: false,
        status: 401,
      })
    );

    render(<ProtectedMessage />);

    await userEvent.click(screen.getByRole("button", { name: /load protected data/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: Authenticated API request failed with status 401"
    );
  });

  it("shows an error when token retrieval fails", async () => {
    const { getAccessTokenSilently } = mockUseAuth0({ isAuthenticated: true });

    getAccessTokenSilently.mockRejectedValue(new Error("Login required"));

    render(<ProtectedMessage />);

    await userEvent.click(screen.getByRole("button", { name: /load protected data/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Error: Login required");
  });
});
