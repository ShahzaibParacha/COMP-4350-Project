/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/**/*.{js,jsx,ts,tsx}",
    "./src//pages/**/*.{html,js}",
    "./src/components/**/*.{html,js}",
    "../public/index.html",
  ],
  mode: "jit",
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        simple: "#52525b",
        primary: "#f2c982",
        secondary: "#0bbfb3",
        accent: "#35f2e8",
        neutral: "#000000",
        "base-100": "#FFFFFF",
        info: "#8AABE0",
        success: "#17BA8C",
        warning: "#F1B25F",
        error: "#EB4228",
      },
      fontFamily: {
        base: ["Quicksand", "sans-serif"],
        local: ["Questrial", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
