/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#3B82F6'
        },
        secondary: {
          DEFAULT: '#0EA5E9',
          light: '#38BDF8'
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        darkBg: '#0F172A',
        lightBg: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        glow: '0 0 25px rgba(37, 99, 235, 0.4)',
      }
    },
  },
  plugins: [],
}
