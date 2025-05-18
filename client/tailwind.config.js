/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'border',
    'border-red-500',
    'border-blue-500',
    'rounded-md',
    'p-1',
    'bg-blue-100',
    'text-blue-800',
    'text-white',
    'bg-blue-500',
    'bg-gray-100',
    'text-gray-900',
  ],
  plugins: [],
}