/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          bg: '#131314',
          card: '#24252b',
        },
        dark: {
          100: '#3a3c3f',
          200: '#24252b',
          300: '#131314',
        },
        // Brand palette derived from #5b4a2c
        brand: {
          50:  '#fdf6ec',
          100: '#f5e2c0',
          200: '#e8c48a',
          300: '#d4a35a',
          400: '#c4893a',
          500: '#5b4a2c',
          600: '#4a3b22',
          700: '#3a2d1a',
          800: '#2a2010',
          900: '#1a1208',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
