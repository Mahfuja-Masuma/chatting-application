/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#DCF2F1',
        'secodary': '#7FC7D9',
        'tertinery': '#0072B1',
        'fourth': '#0F1035',
        'five': '#E3AB4E',
      },

      fontFamily: {
        'poppins': ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}

