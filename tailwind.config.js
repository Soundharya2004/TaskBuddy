/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Use "class" mode for dark theme
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#E5E7EB",
        input: "#F3F4F6",
        ring: "#6366F1",
        background: "#FFFFFF",
        foreground: "#1F2937",
        primary: {
          DEFAULT: "#6366F1", // Indigo color from the design
          foreground: "#E0E7FF",
        },
        secondary: {
          DEFAULT: "#4F46E5",
          foreground: "#C7D2FE",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FEE2E2",
        },
        muted: {
          DEFAULT: "#D1D5DB",
          foreground: "#E5E7EB",
        },
        accent: {
          DEFAULT: "#FBCFE8",
          foreground: "#FCE7F3",
        },
        popover: {
          DEFAULT: "#F9FAFB",
          foreground: "#111827",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#374151",
        },
        success: "#10B981", // Green for completed tasks
        warning: "#F59E0B", // Amber for in-progress tasks
        danger: "#EF4444", // Red for important or delete actions
        info: "#3B82F6", // Blue for informational purposes
        light: "#F3F4F6", // Light gray for backgrounds
        dark: "#1F2937", // Dark gray for text
        gray: {
          100: "#F9FAFB",
          200: "#F3F4F6",
          300: "#E5E7EB",
          400: "#D1D5DB",
          500: "#9CA3AF",
          600: "#6B7280",
          700: "#4B5563",
          800: "#374151",
          900: "#1F2937",
        },
        // Task section colors
        todo: "#FBCFE8", // Pink for todo
        inprogress: "#BFDBFE", // Blue for in-progress tasks
        completed: "#A7F3D0", // Green for completed tasks
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        dropdown: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
