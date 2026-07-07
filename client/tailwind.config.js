/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        accent: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
        },
        sport: {
          bg: '#F0FDF4',
          border: '#BBF7D0',
          text: '#15803D',
        },
        gaming: {
          bg: '#FAF5FF',
          border: '#E9D5FF',
          text: '#7E22CE',
        },
      },
      borderRadius: {
        '2xl': '0.75rem',
        '3xl': '1rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.04), 0 4px 6px rgba(0,0,0,0.02)',
        'card-lg': '0 4px 8px rgba(0,0,0,0.06), 0 8px 12px rgba(0,0,0,0.04)',
        'card-xl': '0 8px 16px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.06)',
        'glow': '0 4px 14px rgba(234, 88, 12, 0.35)',
        'glow-lg': '0 8px 24px rgba(234, 88, 12, 0.40)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
};
