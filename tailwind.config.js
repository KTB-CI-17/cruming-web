/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#735BF2',
        secondary: '#8F9BB3',
      },
    },
  },
  plugins: [],
}