/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode support
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1e293b',
        danger: '#dc2626',
        warning: '#f59e0b',
        success: '#059669',
        info: '#0891b2',
      }
    },
  },
  plugins: [],
}