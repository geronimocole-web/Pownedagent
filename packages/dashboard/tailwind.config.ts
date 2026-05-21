import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        powned: {
          pink:  '#e6007e',
          dark:  '#0a0a0a',
          panel: '#111111',
          card:  '#181818',
          border:'#2a2a2a',
          text:  '#e0e0e0',
          muted: '#888888',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
