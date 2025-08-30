// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Add the new delayed animations here
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
        'fadeInUp-200': 'fadeInUp 0.6s ease-out 200ms forwards',
        'fadeInUp-400': 'fadeInUp 0.6s ease-out 400ms forwards',
        'fadeInUp-600': 'fadeInUp 0.6s ease-out 600ms forwards',
      },
    },
  },
  plugins: [],
}