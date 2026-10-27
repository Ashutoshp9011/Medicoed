import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./welcome.css";

interface User {
  name: string;
  email?: string;
  role?: string;
}

interface MeResponse {
  user: User;
}

function formatName(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Welcome() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCurrentUser() {
      try {
        const response = await fetch("http://localhost:3000/me", {
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to retrieve user information.");
        }

        const result: MeResponse = await response.json();

        if (!result.user || !result.user.name) {
          throw new Error("Invalid user information received.");
        }

        if (isMounted) {
          setUser(result.user);
        }
      } catch (error: unknown) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Could not connect to the backend."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <main className="welcome-page" data-no-particles>
        <p>Loading your account...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="welcome-page" data-no-particles>
        <p role="alert">{error}</p>
        <Link to="/login">Go to Login</Link>
      </main>
    );
  }

  return (
    <main className="welcome-page" data-no-particles>
      <h1 id="welcomeMessage">
        {user
          ? `Welcome back, ${formatName(user.name)}!`
          : "Welcome Back!"}
      </h1>

      <p>We're happy to have you learning with Medicoed.</p>

      <Link to="/signup">Back to Sign Up</Link>
    </main>
  );
}

export default Welcome;