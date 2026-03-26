/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1A1A18',
          2: '#4A4A46',
          3: '#8A8A84',
        },
        surface: {
          DEFAULT: '#FAFAF8',
          2: '#F4F3EF',
          3: '#EDECEA',
          white: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#1B6B45',
          light: '#E8F5EE',
          border: '#B8E0CA',
        },
        orange: {
          DEFAULT: '#C85A1A',
          light: '#FBF0E8',
        },
        blue: {
          DEFAULT: '#1A4B8C',
          light: '#E8EFF8',
        },
        border: {
          DEFAULT: '#E2E1DC',
          2: '#D0CFC8',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        btn: '9px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.10)',
      }
    },
  },
  plugins: [],
}
