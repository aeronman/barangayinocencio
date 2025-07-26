import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/assets/',
  build: {
    outDir: 'build/assets', // generate into /assets in root
    emptyOutDir: true,
  },
  plugins: [
    laravel({
      input: ["resources/js/main.jsx"],
      refresh: true,
    }),
    react(),
  ],
});
