/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        jharkhand: {
          green: '#15803d',
          ochre: '#d97706',
          terracotta: '#c2410c',
          soil: '#78350f',
          dark: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
