/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0F172A',
        'midnight-800': '#131c31',
        'midnight-700': '#1c2740',
        'electric-mint': '#10B981',
        'neon-purple': '#8B5CF6',
        'off-white': '#F8FAFC',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(139, 92, 246, 0.45)',
        'glow-mint': '0 0 40px -8px rgba(16, 185, 129, 0.4)',
        card: '0 1px 2px rgba(0,0,0,0.2), 0 12px 32px -12px rgba(0,0,0,0.55)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 45%, #10B981 120%)',
        'brand-fade': 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(16,185,129,0.12) 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'dot-bounce': {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%': { transform: 'translateY(-4px)', opacity: '1' },
        },
        'zoom-fade': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'dot-bounce': 'dot-bounce 1.4s ease-in-out infinite',
        'zoom-fade': 'zoom-fade 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
