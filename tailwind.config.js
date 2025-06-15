/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ THIS is very important
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
