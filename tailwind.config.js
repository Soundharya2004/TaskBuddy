/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1", // Indigo color from the design
        secondary: "#4F46E5", // Darker indigo for hover states
        success: "#10B981", // Green for completed tasks
        warning: "#F59E0B", // Amber for in progress
        danger: "#EF4444", // Red for important or delete actions
        info: "#3B82F6", // Blue for info
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
        inprogress: "#BFDBFE", // Blue for in progress
        completed: "#A7F3D0", // Green for completed
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
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
  plugins: [],
}

