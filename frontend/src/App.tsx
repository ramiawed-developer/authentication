import { BackendStatus } from "./components/BackendStatus";
import { env } from "./config/env";

export default function App() {
  return (
    <main>
      <h1>Auth0 Full-Stack App</h1>
      <p>Frontend is running.</p>
      <p>Environment: {env.appEnv}</p>
      <p>API URL: {env.apiBaseUrl}</p>

      <hr />

      <BackendStatus />
    </main>
  );
}
