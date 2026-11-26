/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: 'var(--bg-primary)',
        midnight: 'var(--bg-secondary)',
        surface: 'var(--bg-surface)',
        surfaceHover: 'var(--bg-surface-hover)',
        ivory: 'var(--text-primary)',
        slateMuted: 'var(--text-secondary)',
        hairline: 'var(--border-subtle)',
        gold: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-soft)',
          dark: '#8C6835',
          muted: 'var(--color-accent-muted)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Sora"', 'sans-serif'],
        heading: ['"Sora"', '"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', '"Manrope"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        goldGlow: 'var(--shadow-accent)',
        card: 'var(--shadow-elevated)',
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(circle at center, var(--color-accent-muted) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};
