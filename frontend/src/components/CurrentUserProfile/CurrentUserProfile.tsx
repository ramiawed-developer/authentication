import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export function CurrentUserProfile() {
  const { isAuthenticated, isLoading } = useAuth0();
  const { status, user, error, loadCurrentUser } = useCurrentUser();

  if (isLoading) {
    return (
      <section>
        <h2>Application User</h2>
        <p>Checking authentication...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section>
      <h2>Application User</h2>

      {status === "idle" && <button onClick={loadCurrentUser}>Load application user</button>}
      {status === "loading" && <p>Loading application user...</p>}
      {status === "error" && (
        <div role="alert">
          <p>Unable to load application user.</p>
          <p>{error}</p>
          <button onClick={loadCurrentUser}>Try again</button>
        </div>
      )}
      {status === "success" && user && (
        <article>
          <p>
            <strong>Internal ID:</strong> {user.id}
          </p>
          <p>
            <strong>Auth0 ID:</strong> {user.auth0Id}
          </p>
          <p>
            <strong>Email:</strong> {user.email ?? "Not available"}
          </p>
          <p>
            <strong>Name:</strong> {user.name ?? "Not available"}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Created:</strong> {user.createdAt}
          </p>
          <button onClick={loadCurrentUser}>Refresh application user</button>
        </article>
      )}
    </section>
  );
}
