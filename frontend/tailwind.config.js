/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  extend: {
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
    },
  plugins: [],
}