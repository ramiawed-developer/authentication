import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BackendStatus } from "./BackendStatus";

describe("BackendStatus", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading first, then backend status", async () => {
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

    render(<BackendStatus />);

    expect(screen.getByText(/Checking backend status/i)).toBeInTheDocument();
    expect(await screen.findByText(/status: ok/i)).toBeInTheDocument();
    expect(
      screen.getByText(/service: auth0-fullstack-api/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Timestamp: 2026-06-15T12:00:00.000Z/i),
    ).toBeInTheDocument();
  });

  it("shows an error when backend request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    );

    render(<BackendStatus />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error: Network error",
    );
  });
});
