import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { mockUseAuth0 } from "./test/mockAuth0";

describe("App", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the frontend home page", async () => {
    mockUseAuth0({
      isAuthenticated: false,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue({
        ok: true,
        json: async () => ({
          status: "ok",
          service: "auth0-fullstack-api",
          timestamp: "2026-06-15T12:00:00.000Z",
        }),
      }),
    );
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /auth0 full-stack app/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/frontend is running./i)).toBeInTheDocument();
    expect(screen.getByText(/environment:/i)).toBeInTheDocument();
    expect(screen.getByText(/api url:/i)).toBeInTheDocument();
    expect(screen.getByText(/auth0 domain:/i)).toBeInTheDocument();
    expect(screen.getByText(/auth0 audience:/i)).toBeInTheDocument();
    expect(screen.getByText(/you are not logged in/i)).toBeInTheDocument();

    expect(await screen.findByText(/status: ok/i)).toBeInTheDocument();
  });
});
