console.log("JavaScript file loaded!");

const form = document.getElementById("userForm");

// Welcome page logic
const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage) {
    const name = sessionStorage.getItem("userName");

    if (name) {
        welcomeMessage.textContent = `Welcome back, ${name}!`;
    }
}

// Signup and login form logic
if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const nameInput = document.getElementById("name");
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        

        // this is the signup page if the name is exist
        const isSignup = Boolean(nameInput);

        const userData = {
            email,
            password
        };

        if (isSignup) {
            userData.name = nameInput.value.trim();

            const roleInput = document.querySelector(
                'input[name="role"]:checked'
            );

            if (roleInput) {
                userData.role = roleInput.value;
            }
        }

        const endpoint = isSignup
            ? "http://localhost:3000/users"
            : "http://localhost:3000/login";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Request failed"
                );
            }

            // Save the name after successful signup or login.
            const userName = isSignup
                ? userData.name
                : result.user?.name;

            if (userName) {
                sessionStorage.setItem("userName", userName);
            }

            // Open the welcome page.
            window.location.href = "./welcome.html";

        } catch (error) {
            console.error("Authentication error:", error);
            alert(error.message || "Could not connect to the backend.");
        }
    });
}