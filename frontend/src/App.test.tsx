import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the frontend home page", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /auth0 full-stack app/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/frontend is running./i)).toBeInTheDocument();
    expect(screen.getByText(/environment:/i)).toBeInTheDocument();
    expect(screen.getByText(/api url:/i)).toBeInTheDocument();
  });
});
