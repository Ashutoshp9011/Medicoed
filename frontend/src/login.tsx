
import "./login.css";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScratchVideo from "./ScratchVideo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed.");
      }

      if (result.user?.name) {
        sessionStorage.setItem("userName", result.user.name);
      }

      navigate("/welcome");
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not connect to the backend."
      );
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-visual">
          <ScratchVideo
            src="/src/dandk7sciencefacts_ssspin.io_1792676016.mp4"
          />
        </div>

        <div className="login-form-panel">
          <Link to="/signup" className="back">
            &larr; Create account
          </Link>

          <div className="heading">
            <p className="heading__large">Log in</p>
            <h1 className="heading__small">
              Welcome back to MedicoEd.
            </h1>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />

            {message && (
              <p className="login-message" role="alert">
                {message}
              </p>
            )}

            <button type="submit">Log in</button>
          </form>

          <p className="form__note">
            New to MedicoEd? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
