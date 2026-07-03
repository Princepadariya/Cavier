/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gold': '#d4af37',
      },
      fontFamily: {
        sans: ['Halyard Text', 'Inter', 'sans-serif'],
        text: ['Halyard Text', 'Inter', 'sans-serif'],
        heading: ['Halyard Micro', 'Inter', 'sans-serif'],
        // Existing `font-outfit` heading class across the project now resolves
        // to Halyard Micro, so all main headings use it without edits.
        outfit: ['Halyard Micro', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
