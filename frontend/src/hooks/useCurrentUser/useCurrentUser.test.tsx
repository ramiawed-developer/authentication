import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCurrentUser } from "./useCurrentUser";
import { mockUseAuth0 } from "../../test/mockAuth0";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function TestCurrentUserHook() {
  const { user, status, error, loadCurrentUser, resetCurrentUser } = useCurrentUser();

  return (
    <div>
      <p>Status: {status}</p>
      {user && <p>User: {user.email}</p>}
      {error && <p role="alert">Error: {error}</p>}
      <button onClick={loadCurrentUser}>Load</button>
      <button onClick={resetCurrentUser}>Reset</button>
    </div>
  );
}

describe("useCurrentUser", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("starts idle", () => {
    mockUseAuth0({ isAuthenticated: false, isLoading: false });

    render(<TestCurrentUserHook />);

    expect(screen.getByText(/status: idle/i)).toBeInTheDocument();
  });

  it("stays idle when loading is requested while unauthenticated", async () => {
    mockUseAuth0({ isAuthenticated: false, isLoading: false });
    render(<TestCurrentUserHook />);
    await userEvent.click(screen.getByRole("button", { name: /load/i }));
    expect(screen.getByText(/status: idle/i)).toBeInTheDocument();
  });

  it("loads the current user when authenticated", async () => {
    const { getAccessTokenSilently } = mockUseAuth0({ isAuthenticated: true, isLoading: false });

    getAccessTokenSilently.mockResolvedValue("test-access-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          user: {
            id: "user-id",
            auth0Id: "auth0|123",
            email: "user@example.com",
            name: "Test User",
            picture: null,
            role: "USER",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        }),
      })
    );

    render(<TestCurrentUserHook />);

    expect(screen.getByText(/status: idle/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /load/i }));

    expect(await screen.findByText("Status: success")).toBeInTheDocument();
    expect(screen.getByText("User: user@example.com")).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/me",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-access-token",
        }),
      })
    );
  });

  it("shows error when token retrieval fails", async () => {
    const { getAccessTokenSilently } = mockUseAuth0({ isAuthenticated: true, isLoading: false });

    getAccessTokenSilently.mockRejectedValue(new Error("Login required"));

    render(<TestCurrentUserHook />);

    await userEvent.click(screen.getByRole("button", { name: /load/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Error: Login required");
  });

  it("resets current user state", async () => {
    const { getAccessTokenSilently } = mockUseAuth0({ isAuthenticated: true, isLoading: false });

    getAccessTokenSilently.mockResolvedValue("test-access-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          user: {
            id: "user-id",
            auth0Id: "auth0|123",
            email: "reset@example.com",
            name: "Reset User",
            picture: null,
            role: "USER",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        }),
      })
    );

    render(<TestCurrentUserHook />);

    expect(screen.getByText(/status: idle/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /load/i }));

    expect(await screen.findByText("User: reset@example.com")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /reset/i }));

    expect(screen.getByText("Status: idle")).toBeInTheDocument();
  });
});
