import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EEF4FF',
          100: '#E0EAFF',
          200: '#C3D5FD',
          300: '#9DBAFB',
          400: '#7CAFFC',
          500: '#5B8DEF',
          600: '#4A7AE0',
          700: '#3865C8',
          800: '#2D52A8',
          900: '#23418A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'brand-sm': '0 2px 8px rgba(91,141,239,0.14)',
        'brand':    '0 4px 20px rgba(91,141,239,0.22)',
        'brand-lg': '0 8px 40px rgba(91,141,239,0.28)',
        'card':     '0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)',
        'card-hover':'0 4px 20px rgba(15,23,42,0.10)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 1.4s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
