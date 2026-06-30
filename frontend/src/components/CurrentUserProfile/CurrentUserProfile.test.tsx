import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockUseAuth0 } from "../../test/mockAuth0";
import { render, screen } from "@testing-library/react";
import { CurrentUserProfile } from "./CurrentUserProfile";
import userEvent from "@testing-library/user-event";

function mockMeSuccess(email = "user@example.com") {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        user: {
          id: "user-id",
          auth0Id: "auth0|123",
          email,
          name: "Test User",
          picture: null,
          role: "USER",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      }),
    })
  );
}

describe("CurrentUserProfile", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("show authentication loading state", () => {
    mockUseAuth0({ isLoading: true });

    render(<CurrentUserProfile />);

    expect(screen.getByText("Checking authentication...")).toBeInTheDocument();
  });

  it("render nothing when not authenticated", () => {
    mockUseAuth0({ isAuthenticated: false, isLoading: false });

    const { container } = render(<CurrentUserProfile />);

    expect(container).toBeEmptyDOMElement();
  });

  it("display the application user when authenticated", async () => {
    const { getAccessTokenSilently } = mockUseAuth0({ isAuthenticated: true, isLoading: false });
    getAccessTokenSilently.mockResolvedValue("test-access-token");

    mockMeSuccess("user@example.com");

    render(<CurrentUserProfile />);

    await userEvent.click(screen.getByRole("button", { name: /load application user/i }));

    expect(await screen.findByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByText("auth0|123")).toBeInTheDocument();
    expect(screen.getByText("USER")).toBeInTheDocument();
  });

  it("display an error and retrun button when /api/me fails", async () => {
    const { getAccessTokenSilently } = mockUseAuth0({ isAuthenticated: true, isLoading: false });

    getAccessTokenSilently.mockResolvedValue("bad-access-token");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      })
    );

    render(<CurrentUserProfile />);

    await userEvent.click(screen.getByRole("button", { name: /load application user/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to load application user.");
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("reloads the application user when refresh is clicked", async () => {
    const { getAccessTokenSilently } = mockUseAuth0({ isAuthenticated: true, isLoading: false });

    getAccessTokenSilently.mockResolvedValue("test-access-token");
    mockMeSuccess("refresh@example.com");

    render(<CurrentUserProfile />);

    await userEvent.click(screen.getByRole("button", { name: /load application user/i }));
    expect(await screen.findByText("refresh@example.com")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /refresh application user/i }));

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
