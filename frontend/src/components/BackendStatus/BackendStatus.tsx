import { useEffect, useState } from "react";
import type { HealthResponse } from "../../api/types";
import { getHealth } from "../../api/health";

type RequestState =
  | { status: "loading" }
  | { status: "success"; data: HealthResponse }
  | { status: "error"; message: string };

export function BackendStatus() {
  const [state, setState] = useState<RequestState>({ status: "loading" });

  useEffect(() => {
    let ignore = false;

    async function loadHealth() {
      try {
        const data = await getHealth();
        if (!ignore) {
          setState({
            status: "success",
            data,
          });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to load backend status",
          });
        }
      }
    }

    loadHealth();

    return () => {
      ignore = true;
    };
  }, []);

  if (state.status === "loading") {
    return <p>Checking backend status...</p>;
  }

  if (state.status === "error") {
    return (
      <section>
        <h2>Backend Status</h2>
        <p role="alert">Error: {state.message}</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Backend Status</h2>
      <p>Status: {state.data.status}</p>
      <p>Service: {state.data.service}</p>
      <p>Timestamp: {state.data.timestamp}</p>
    </section>
  );
}
