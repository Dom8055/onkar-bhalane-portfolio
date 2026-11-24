/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#080B12',
        midnight: '#101522',
        surface: '#151C2B',
        surfaceHover: '#1B2437',
        gold: {
          DEFAULT: 'var(--color-accent, #B68B50)',
          light: '#D8B779',
          dark: '#8C6835',
          muted: 'rgba(182, 139, 80, 0.14)',
        },
        ivory: '#F5F5F5',
        slateMuted: '#A3AAB8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Sora"', 'sans-serif'],
        heading: ['"Sora"', '"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', '"Manrope"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        goldGlow: '0 0 40px -10px rgba(182, 139, 80, 0.35)',
        card: '0 20px 60px -25px rgba(0, 0, 0, 0.75)',
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(circle at center, rgba(182, 139, 80, 0.16) 0%, transparent 70%)',
        'grid-subtle': 'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
