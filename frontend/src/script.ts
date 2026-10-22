console.log("JavaScript file loaded!");

// TYPES
interface UserData {
    name?: string;
    email: string;
    password: string;
    role?: string;
}

interface LoginResponse {
    message?: string;
    user?: {
        name?: string;
        email?: string;
    };
}

// WELCOME PAGE
const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage) {
    const name = sessionStorage.getItem("userName");

    if (name) {
        const formattedName = name
            .toLowerCase()
            .split(" ")
            .map(
                (word: string) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");

        welcomeMessage.textContent = `Welcome back, ${formattedName}!`;
    }
}

// SIGNUP & LOGIN
const form = document.getElementById("userForm") as HTMLFormElement | null;

if (form) {
    form.addEventListener("submit", async (event: SubmitEvent) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const nameInput = document.getElementById(
            "name"
        ) as HTMLInputElement | null;

        const emailInput = document.getElementById(
            "email"
        ) as HTMLInputElement | null;

        const passwordInput = document.getElementById(
            "password"
        ) as HTMLInputElement | null;

        if (!emailInput || !passwordInput) {
            alert("Required form fields are missing.");
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // If #name exists, this is signup.
        // Otherwise, this is login.
        const isSignup = Boolean(nameInput);

        const userData: UserData = {
            email,
            password
        };

        // SIGNUP
    if (isSignup && nameInput) {
          userData.name = nameInput.value.trim();

        const roleInput = document.querySelector<HTMLInputElement>(
        'input[name="role"]:checked'
          );

    if (!roleInput) {
        const message = document.getElementById("formMessage");

        if (message) {
            message.textContent = "Please select your role.";
        }

        return;
    }

    userData.role = roleInput.value;
}

        // API ENDPOINT
        const endpoint = isSignup
            ? "http://localhost:3000/users"
            : "http://localhost:3000/login";

        try {
            console.log("Sending request to:", endpoint);

            // Avoid logging passwords in production.
            console.log("Sending authentication request.");

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const result: LoginResponse = await response.json();

            console.log("Backend response:", result);

            if (!response.ok) {
                throw new Error(
                    result.message || "Request failed"
                );
            }

            // SAVE USER NAME
            const userName = isSignup
                ? userData.name
                : result.user?.name;

            if (userName) {
                sessionStorage.setItem("userName", userName);
            }

            // REDIRECT TO WELCOME PAGE
            console.log("Redirecting to welcome.html...");

            window.location.href = "./welcome.html";

        } catch (error: unknown) {
            console.error("Authentication error:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Could not connect to the backend.";

            alert(errorMessage);
        }
    });
}
