import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f5f4f0',
        surface: '#ffffff',
        sidebar: '#1a1917',
        'accent-peca': '#1D4ED8',
        'accent-peca-light': '#E6F1FB',
        'accent-tecido': '#059669',
        'accent-tecido-light': '#EAF3DE',
        'text-primary': '#1a1917',
        'text-secondary': '#6b7280',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
