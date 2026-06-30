import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { mockUseAuth0 } from "./test/mockAuth0";

describe("App", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the frontend home page", async () => {
    mockUseAuth0({
      isLoading: false,
      isAuthenticated: false,
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "ok",
          service: "auth0-fullstack-api",
          timestamp: "2026-06-15T12:00:00.000Z",
        }),
      })
    );

    render(<App />);

    expect(screen.getByRole("heading", { name: /auth0 full-stack app/i })).toBeInTheDocument();

    expect(screen.getByText(/frontend is running/i)).toBeInTheDocument();
    expect(screen.getByText(/you are not logged in/i)).toBeInTheDocument();

    expect(await screen.findByText(/status: ok/i)).toBeInTheDocument();
  });
});
