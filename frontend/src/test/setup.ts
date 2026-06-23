import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { useAuth0Mock } from "./mockAuth0";

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: useAuth0Mock,
  Auth0Provider: ({ children }: { children: React.ReactNode }) => children,
}));
