/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: {
          DEFAULT: '#111115',
          card: '#111115',
          input: '#18181b',
          hover: '#1a1a20',
          elevated: '#16161c',
        },
        primary: {
          DEFAULT: '#ff4359',
          hover: '#ff5c70',
          active: '#e63248',
          glow: 'rgba(255, 67, 89, 0.35)',
          muted: 'rgba(255, 67, 89, 0.15)',
        },
        border: {
          DEFAULT: '#27272a',
          subtle: '#27272a80',
        },
        text: {
          primary: '#f4f4f5',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 67, 89, 0.35)',
        'glow-sm': '0 0 12px rgba(255, 67, 89, 0.25)',
        'glow-lg': '0 0 35px rgba(255, 67, 89, 0.45)',
        'glow-accent': '0 0 15px rgba(255, 67, 89, 0.25)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-2px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(3px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-5px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(5px, 0, 0)' },
        },
      },
    },
  },
  plugins: [],
}
