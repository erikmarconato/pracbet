/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#fb923c',
          light: '#fdba74',
          dark: '#f97316',
          soft: '#fff7ed',
        },
        blue: {
          DEFAULT: '#60a5fa',
          light: '#93c5fd',
          dark: '#3b82f6',
          soft: '#eff6ff',
        },
        neutral: {
          DEFAULT: '#f5f5f4',
          light: '#fafaf9',
          dark: '#e7e5e4',
        },
        success: {
          DEFAULT: '#22c55e',
          light: '#4ade80',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
