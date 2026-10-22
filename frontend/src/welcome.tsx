
import { useState } from "react";
import { Link } from "react-router-dom";
import "./welcome.css";

function formatName(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Welcome() {
  const [name] = useState<string | null>(() =>
    sessionStorage.getItem("userName")
  );

  return (
    <main className="welcome-page" data-no-particles>
      <h1 id="welcomeMessage">
        {name ? `Welcome back, ${formatName(name)}!` : "Welcome Back!"}
      </h1>

      <p>We're happy to have you learning with Medicoed.</p>

      <Link to="/signup">Back to Sign Up</Link>
    </main>
  );
}

export default Welcome;
