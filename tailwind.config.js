/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sda-navy': '#0F2942',
        'sda-gold': '#D4AF37',
        'sda-sand': '#F7F4EF',
        'sda-charcoal': '#2D3142',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'editorial': '0 10px 40px -10px rgba(15, 41, 66, 0.25)',
      },
    },
  },
  plugins: [],
}
