import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { mockUseAuth0 } from "../../test/mockAuth0";
import { render, screen } from "@testing-library/react";
import { AccessTokenPreview } from "./AccessTokenPreview";

describe("AccessTokenPreview", () => {
  it("render nothing when the user is not authenticated", () => {
    mockUseAuth0({
      isAuthenticated: false,
    });

    const { container } = render(<AccessTokenPreview />);

    expect(container).toBeEmptyDOMElement();
  });

  it("gets and display an access token preview", async () => {
    const token = "abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz";
    const { getAccessTokenSilently } = mockUseAuth0({
      isAuthenticated: true,
    });

    getAccessTokenSilently.mockResolvedValue(token);

    render(<AccessTokenPreview />);

    await userEvent.click(
      screen.getByRole("button", {
        name: /get access token/i,
      })
    );

    expect(await screen.findByText(/token preview:/i)).toBeInTheDocument();
    expect(screen.getByText(`${token.slice(0, 40)}...`)).toBeInTheDocument();
  });

  it("shows an error when token retreival fails", async () => {
    const { getAccessTokenSilently } = mockUseAuth0({
      isAuthenticated: true,
    });

    getAccessTokenSilently.mockRejectedValue(new Error("Login required"));

    render(<AccessTokenPreview />);

    await userEvent.click(
      screen.getByRole("button", {
        name: /get access token/i,
      })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("Token error: Login required");
  });
});
