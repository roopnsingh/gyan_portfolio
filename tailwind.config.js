/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        charcoal: '#1a1a1a',
        ash: '#2d2d2d',
        accent: '#0358b9',
        'accent-light': '#4a8fd4',
        'accent-dark': '#024a94',
        cream: '#f5f0e8',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        bebas: ['"Bebas Neue"', 'cursive'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
