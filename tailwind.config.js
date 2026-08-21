/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0F172A',
        'electric-mint': '#10B981',
        'neon-purple': '#8B5CF6',
        'off-white': '#F8FAFC',
      },
    },
  },
  plugins: [],
}
