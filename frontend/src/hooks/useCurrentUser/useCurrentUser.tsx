import { useCallback, useState } from "react";
import { getMe, type CurrentUser } from "../../api/me";
import { useAuth0 } from "@auth0/auth0-react";

export type CurrentUserState =
  | { status: "idle"; user: null; error: null }
  | { status: "loading"; user: null; error: null }
  | { status: "success"; user: CurrentUser; error: null }
  | { status: "error"; user: null; error: string };

const initialState: CurrentUserState = {
  status: "idle",
  user: null,
  error: null,
};

export function useCurrentUser() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [state, setState] = useState<CurrentUserState>(initialState);

  const loadCurrentUser = useCallback(async () => {
    if (!isAuthenticated) {
      setState({
        status: "idle",
        user: null,
        error: null,
      });
      return;
    }
    try {
      setState({
        status: "loading",
        user: null,
        error: null,
      });

      const accessToken = await getAccessTokenSilently();
      const response = await getMe(accessToken);

      setState({
        status: "success",
        user: response.user,
        error: null,
      });
    } catch (err) {
      setState({
        status: "error",
        user: null,
        error: err instanceof Error ? err.message : "Unable to load current user",
      });
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  const resetCurrentUser = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    loadCurrentUser,
    resetCurrentUser,
  };
}
