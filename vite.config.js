import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  server: {
    allowedHosts: [".trycloudflare.com"],
  },
  resolve: {
    alias: {
      "~": path.resolve("app"),
    },
  },
});
