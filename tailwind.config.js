/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        broadcast: {
          bg: '#020D20',
          navy: '#061B3A',
          navySec: '#0B2B55',
          blueHighlight: '#064D8C',
          footerBg: '#031834',
          cyan: '#00D9F5',
          tournamentGreen: '#17C978',
          scoreGreen: '#13C980',
          yellow: '#FFD229',
          red: '#E32636',
          white: '#FFFFFF',
          grayText: '#C8D2E1',
          border: 'rgba(0, 217, 245, 0.3)',
          borderStrong: 'rgba(0, 217, 245, 0.7)',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
        score: ['"Barlow Condensed"', 'sans-serif'],
        mono: ['"Barlow Condensed"', 'monospace'],
        script: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'tv-card': '0 4px 18px rgba(0, 0, 0, 0.28)',
        'tv-glow-cyan': '0 4px 18px rgba(0, 0, 0, 0.28), 0 0 14px rgba(0, 217, 245, 0.25)',
        'tv-glow-green': '0 4px 18px rgba(0, 0, 0, 0.28), 0 0 14px rgba(23, 201, 120, 0.3)',
        'cyan-glow': '0 4px 18px rgba(0, 0, 0, 0.28), 0 0 12px rgba(0, 217, 245, 0.3)',
        'cyan-glow-lg': '0 4px 20px rgba(0, 0, 0, 0.35), 0 0 20px rgba(0, 217, 245, 0.4)',
        'red-glow': '0 4px 18px rgba(0, 0, 0, 0.28), 0 0 14px rgba(227, 38, 54, 0.4)',
        'green-glow': '0 4px 18px rgba(0, 0, 0, 0.28), 0 0 14px rgba(23, 201, 120, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash-cyan': 'flashCyan 0.4s ease-out',
        'flash-red': 'flashRed 0.4s ease-out',
      },
      keyframes: {
        flashCyan: {
          '0%, 100%': { transform: 'scale(1)', color: 'inherit' },
          '50%': { transform: 'scale(1.08)', color: '#00D9F5' },
        },
        flashRed: {
          '0%, 100%': { transform: 'scale(1)', color: 'inherit' },
          '50%': { transform: 'scale(1.08)', color: '#E32636' },
        }
      }
    },
  },
  plugins: [],
}
