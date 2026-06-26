import { vi } from "vitest";

type MockAuth0User = {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
};

type MockAuth0State = {
  isAuthenticated?: boolean;
  isLoading?: boolean;
  error?: Error;
  user?: MockAuth0User;
};

export function mockUseAuth0({ isAuthenticated, isLoading, error, user }: MockAuth0State = {}) {
  const loginWithRedirect = vi.fn();
  const logout = vi.fn();
  const getAccessTokenSilently = vi.fn();

  vi.mocked(useAuth0Mock).mockReturnValue({
    isAuthenticated,
    isLoading,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  });

  return {
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  };
}

export const useAuth0Mock = vi.fn();
