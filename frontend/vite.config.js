import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // ✅ Ensure correct base path
  server: {
    historyApiFallback: true, // ✅ Fix routing issue
  },
  build: {
    outDir: "dist", // ✅ Ensure correct output folder
  },
});
