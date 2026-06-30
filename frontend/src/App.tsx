import { AccessTokenPreview } from "./components/AccessTokenPreview/AccessTokenPreview";
import { AuthStatus } from "./components/AuthStatus";
import { BackendStatus } from "./components/BackendStatus";
import { CurrentUserProfile } from "./components/CurrentUserProfile";
import { ProtectedMessage } from "./components/ProtectedMessage";
import { env } from "./config/env";

export default function App() {
  return (
    <main>
      <h1>Auth0 Full-Stack App</h1>
      <p>Frontend is running.</p>
      <p>Environment: {env.appEnv}</p>
      <p>API URL: {env.apiBaseUrl}</p>
      <p>Auth0 Domain: {env.auth0.domain}</p>
      <p>Auth0 Audience: {env.auth0.audience}</p>
      <hr />

      <AuthStatus />
      <CurrentUserProfile />
      <AccessTokenPreview />
      <ProtectedMessage />
      <hr />

      <BackendStatus />
    </main>
  );
}
