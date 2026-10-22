
import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
   plugins: [react()],
  appType: "spa",
  build: {
    rollupOptions: {
      input: {
        login: resolve(projectRoot, "src/login.html"),
        signup: resolve(projectRoot, "src/signup.html"),
        welcome: resolve(projectRoot, "src/welcome.html"),
      },
    },
  },
});
