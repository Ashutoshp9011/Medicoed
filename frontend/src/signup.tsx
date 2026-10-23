import "./signup.css";
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!role) {
      setMessage("Please select your role.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      const result: {
        message?: string;
        user?: { name?: string; email?: string };
      } = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signup failed.");
      }

      sessionStorage.setItem(
        "userName",
        result.user?.name || name.trim()
      );

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
    <div className="signup-page">
      <main className="card">
        {/* Original video section */}
        <section className="card__visual" aria-hidden="true">
          <video autoPlay muted loop playsInline>
            <source
              src="/src/From%20Klickpin.com-%2022%20Snack%20Board%20Ideas%20That%20Look%20So%20Expensive-pin-id-685391637064971127.mp4"
              type="video/mp4"
            />
            Your browser does not support video playback.
          </video>
        </section>

        {/* Original signup form layout */}
        <section className="card__form">
          <Link to="/login" className="back">
            &larr; Go back
          </Link>

          <div className="heading">
            <p className="heading__large">Sign up</p>
            <h1 className="heading__small">
              Start learning with Medicoed today.
            </h1>
          </div>

          <form
            id="userForm"
            className="form"
            onSubmit={handleSubmit}
          >
            <input
              id="name"
              name="name"
              type="text"
              placeholder="FULL NAME"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              style={{ textTransform: "uppercase" }}
            />

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
            />

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="new-password"
            />

            <div className="choice">
              <p>I am a -</p>

              <fieldset className="signup-roles">
                <legend className="sr-only">
                  Select your role
                </legend>

                <label htmlFor="student">
                  <input
                    type="radio"
                    id="student"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={(event) =>
                      setRole(event.target.value)
                    }
                    required
                  />
                  Student
                </label>

                <label htmlFor="educator">
                  <input
                    type="radio"
                    id="educator"
                    name="role"
                    value="educator"
                    checked={role === "educator"}
                    onChange={(event) =>
                      setRole(event.target.value)
                    }
                  />
                  Educator
                </label>

                <label htmlFor="admin">
                  <input
                    type="radio"
                    id="admin"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(event) =>
                      setRole(event.target.value)
                    }
                  />
                  Admin
                </label>
              </fieldset>
            </div>

            {message && (
              <p
                className="form__note signup-message"
                role="alert"
              >
                {message}
              </p>
            )}

            <button type="submit">Sign up</button>

            <p
              id="formMessage"
              className="form__note"
              role="status"
            />

            <p className="form__note">
              Already have an account?{" "}
              <Link to="/login">Login.</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Signup