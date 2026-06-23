import type { ReactNode } from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import type { AppState } from "@auth0/auth0-react";
import { env } from "../../config/env";
import { useNavigate } from "react-router-dom";

type Auth0ProviderWithNavigateProps = {
  children: ReactNode;
};

export function Auth0ProviderWithNavigate({
  children,
}: Auth0ProviderWithNavigateProps) {
  const navigate = useNavigate();
  function handleRedirectCallback(appState?: AppState) {
    navigate(appState?.returnTo ?? "/", { replace: true });
  }

  return (
    <Auth0Provider
      domain={env.auth0.domain}
      clientId={env.auth0.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: env.auth0.audience,
      }}
      onRedirectCallback={handleRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
