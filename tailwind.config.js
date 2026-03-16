/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#16a34a',
          blue: '#2563eb',
          sky: '#0ea5e9',
          dark: '#1e293b',
        },
      },
    },
  },
  plugins: [],
}
