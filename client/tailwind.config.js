/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary accent — a single, confident indigo/violet
        accent: {
          DEFAULT: '#7c5cff',
          soft: '#9d86ff',
          muted: 'rgba(124,92,255,0.12)',
        },
        ink: {
          950: '#07070c',
          900: '#0b0b14',
          800: '#12121d',
          700: '#1a1a28',
          600: '#242435',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 60px -15px rgba(124,92,255,0.45)',
        card: '0 8px 30px -12px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'grid-dark':
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: { float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
};
