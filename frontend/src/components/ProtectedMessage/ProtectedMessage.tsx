import { useState } from "react";
import { getPrivateMessage, type PrivateMessageResponse } from "../../api/private";
import { useAuth0 } from "@auth0/auth0-react";

type ProtectedMessageState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: PrivateMessageResponse }
  | { status: "error"; message: string };

export function ProtectedMessage() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [state, setState] = useState<ProtectedMessageState>({ status: "idle" });

  async function handleLoadPrivateMessage() {
    try {
      setState({ status: "loading" });

      const accessToken = await getAccessTokenSilently();
      const data = await getPrivateMessage(accessToken);

      setState({
        status: "success",
        data,
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to load protected backend data",
      });
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section>
      <h2>Protected Backend data</h2>

      <button onClick={handleLoadPrivateMessage}>Load protected data</button>

      {state.status === "loading" && <p>Loading protected data...</p>}
      {state.status === "success" && <p>{state.data.message}</p>}
      {state.status === "error" && <p role="alert">Error: {state.message}</p>}
    </section>
  );
}
