import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the frontend home page", async () => {
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

    expect(await screen.findByText(/status: ok/i)).toBeInTheDocument();
  });
});
