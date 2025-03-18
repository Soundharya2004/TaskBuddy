import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // Add this to ensure proper handling of CommonJS modules
  optimizeDeps: {
    include: ["tailwindcss-animate"],
  },
})

