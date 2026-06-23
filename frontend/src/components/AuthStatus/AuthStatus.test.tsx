import { describe, expect, it } from "vitest";
import { mockUseAuth0 } from "../../test/mockAuth0";
import { render, screen } from "@testing-library/react";
import { AuthStatus } from "./AuthStatus";

describe("AuthStatus", () => {
  it("shows loading state", () => {
    mockUseAuth0({
      isLoading: true,
    });

    render(<AuthStatus />);

    expect(screen.getByText(/Checking authentication/i)).toBeInTheDocument();
  });

  it("shows logged in user profile", () => {
    mockUseAuth0({
      isAuthenticated: true,
      user: {
        name: "Ramy Awed",
        email: "ramyawed@gmail.com",
        sub: "auth0|123",
      },
    });

    render(<AuthStatus />);

    expect(screen.getByText(/you are logged in/i)).toBeInTheDocument();
    expect(screen.getByText(/name: ramy awed/i)).toBeInTheDocument();
    expect(screen.getByText(/email: ramyawed@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/user id: auth0|123/i)).toBeInTheDocument();
  });

  it("shows auth error", () => {
    mockUseAuth0({
      error: new Error("Auth failed"),
    });

    render(<AuthStatus />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Authentication error: Auth failed",
    );
  });
});
