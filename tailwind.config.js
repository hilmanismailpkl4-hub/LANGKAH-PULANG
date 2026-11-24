/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Lora"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        dusk: {
          950: '#0d0f14',
          900: '#141821',
          800: '#1e2433',
          700: '#2d3548',
        },
        warm: {
          50: '#fdf8f0',
          100: '#f9ecd9',
          200: '#f1d5af',
          300: '#e7b87d',
          400: '#dc9950',
          500: '#cc7f35',
          600: '#a96227',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gentlePulse: {
          '0%, 100%': { opacity: '0.65' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.45s ease-out forwards',
        gentlePulse: 'gentlePulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
