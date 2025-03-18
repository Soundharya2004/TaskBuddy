import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  optimizeDeps: {
    include: [
      "tailwindcss",
      "autoprefixer",
      "firebase",
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "firebase/storage",
      "@firebase/app",
      "@firebase/auth",
      "@firebase/firestore",
      "@firebase/storage",
      "@firebase/util",
      "@firebase/component",
      "@firebase/logger",
    ],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/firebase/, /node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage"],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  define: {
    "process.env": {},
    global: {},
  },
})

