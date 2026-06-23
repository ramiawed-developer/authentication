import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "../LogoutButton";
import { LoginButton } from "../LoginButton";

export function AuthStatus() {
  const { isAuthenticated, isLoading, error, user } = useAuth0();

  if (isLoading) {
    return <p>Checking authentication...</p>;
  }

  if (error) {
    console.log(error);
    return <p role="alert">Authentication error: {error.message}</p>;
  }

  if (!isAuthenticated) {
    return (
      <section>
        <h2>Authentication</h2>
        <p>You are not logged in.</p>
        <LoginButton />
      </section>
    );
  }

  return (
    <section>
      <h2>Authentication</h2>
      <p>You are logged in.</p>
      <LogoutButton />

      <h3>User Profile</h3>
      {user?.picture && (
        <img src={user.picture} alt={user.name ?? "User Profile"} width={64} height={64} />
      )}
      <p>Name: {user?.name ?? "Unknown"}</p>
      <p>Email: {user?.email ?? "Unknown"}</p>
      <p>User ID: {user?.sub ?? "Unknown"}</p>
    </section>
  );
}
