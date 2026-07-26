/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        app: '#F5F6FA',
        surface: '#FFFFFF',
        border: '#E7E9F1',
        nav: {
          DEFAULT: '#0B1220',
          raised: '#111A2E',
          border: '#1E293F',
        },
        ink: '#0F172A',
        muted: '#64748B',
        faint: '#94A3B8',
        brand: {
          DEFAULT: '#16A34A',
          bright: '#22C55E',
          soft: '#DCFCE7',
        },
        violet: {
          DEFAULT: '#7C3AED',
          bright: '#8B5CF6',
          soft: '#EDE9FE',
        },
        rose: {
          DEFAULT: '#E11D48',
          bright: '#F43F5E',
          soft: '#FFE4E6',
        },
        amber: {
          DEFAULT: '#D97706',
          bright: '#F59E0B',
          soft: '#FEF3C7',
        },
        sky: {
          DEFAULT: '#0284C7',
          bright: '#38BDF8',
          soft: '#E0F2FE',
        },
        pink: {
          DEFAULT: '#DB2777',
          bright: '#EC4899',
          soft: '#FCE7F3',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}
