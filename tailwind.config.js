/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shield: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#030712',
        }
      }
    },
  },
  plugins: [],
}
