/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#6366F1", // Indigo color from the design
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#4F46E5",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#D1D5DB",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#FBCFE8",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "#10B981", // Green for completed tasks
        warning: "#F59E0B", // Amber for in-progress tasks
        danger: "#EF4444", // Red for important or delete actions
        info: "#3B82F6", // Blue for informational purposes
        light: "#F3F4F6", // Light gray for backgrounds
        dark: "#1F2937", // Dark gray for text
        "gray-100": "#F9FAFB",
        "gray-200": "#F3F4F6",
        "gray-300": "#E5E7EB",
        "gray-400": "#D1D5DB",
        "gray-500": "#9CA3AF",
        "gray-600": "#6B7280",
        "gray-700": "#4B5563",
        "gray-800": "#374151",
        "gray-900": "#1F2937",
        // Task section colors
        todo: "#FBCFE8", // Pink for todo
        inprogress: "#BFDBFE", // Blue for in-progress tasks
        completed: "#A7F3D0", // Green for completed tasks
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
