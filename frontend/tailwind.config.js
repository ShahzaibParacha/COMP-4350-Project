/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],

    themes: [
        extend ={
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
        },
        {
            base: {
                "primary": "#0e845f",
                "secondary": "#f25968",
                "accent": "#c46f3e",
                "neutral": "#282D3E",
                "base-100": "#E7E8E9",
                "info": "#61B4E0",
                "success": "#0F624D",
                "warning": "#A0600E",
                "error": "#F94E7B",
            },
        }
    ],
    plugins: [],
}