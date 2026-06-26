import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

type TokenState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; tokenPreview: string }
  | { status: "failed"; message: string };

export function AccessTokenPreview() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [state, setState] = useState<TokenState>({ status: "idle" });

  async function handleGetAccessToken() {
    try {
      setState({ status: "loading" });

      const token = await getAccessTokenSilently();

      setState({
        status: "success",
        tokenPreview: `${token.slice(0, 40)}...`,
      });
    } catch (error) {
      setState({
        status: "failed",
        message: error instanceof Error ? error.message : "Unable to get access token",
      });
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section>
      <h2>Access token</h2>
      <p>This is only for learning. Do not display tokens in production UI.</p>

      <button onClick={handleGetAccessToken}>Get access token</button>
      {state.status === "loading" && <p>Getting access token...</p>}
      {state.status === "success" && (
        <p>
          Token preview: <code>{state.tokenPreview}</code>
        </p>
      )}
      {state.status === "failed" && <p role="alert">Token error: {state.message}</p>}
    </section>
  );
}
