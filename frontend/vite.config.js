import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",  // ✅ Render Deployment Fix
  build: {
    outDir: "dist",  // ✅ Correct Output Directory for Deployment
  },
});
