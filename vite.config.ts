import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "/MechanicsDrill/",
  plugins: [tailwindcss()],
  server: {
    watch: {
      ignored: ["**/.local/**", "**/.playwright-cli/**", "**/docs/assets/**"],
    },
  },
});
