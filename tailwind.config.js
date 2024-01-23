/** @type {import('tailwindcss').Config} */
const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{html,js.ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightBlack: "#3a3541ad",
        DEFAULT: colors.primary, // Replace this with your MUI primary color

      },
    },

  },
  plugins: [],
}