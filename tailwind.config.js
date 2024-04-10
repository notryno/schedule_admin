/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        errorRed: "#d32f2f",
        formColor: "#e5e7eb",
      },
    },
  },
  plugins: [],
};
