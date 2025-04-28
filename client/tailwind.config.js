/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}", // Adjust this based on your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('checked-within', '&:has(input[type="checkbox"]:checked, input[type="radio"]:checked)');
    }),
  ],
}