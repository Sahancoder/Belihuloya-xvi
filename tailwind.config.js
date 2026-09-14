/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './control.html', './overlay.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Operator control panel — dark navy 80%, tournament accents 20%.
        ops: {
          bg: '#06172D',
          panel: '#0A213D',
          inset: '#0C2847',
          line: '#163A5E',
          muted: '#9FB3CC',
          dim: '#6B83A3',
          cyan: '#00CFE8',
          green: '#10C981',
          red: '#EF3340',
          gold: '#F6C445',
          orange: '#F59E0B',
        },
        // Broadcast overlay.
        broadcast: {
          bg: '#020D20',
          navy: '#061B3A',
          navySec: '#0B2B55',
          cyan: '#00D9F5',
          green: '#17C978',
          yellow: '#FFD229',
          red: '#E32636',
          grayText: '#C8D2E1',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Segoe UI', 'system-ui', 'sans-serif'],
        score: ['"Barlow Condensed"', 'Bahnschrift', '"Arial Narrow"', 'sans-serif'],
        script: ['Caveat', '"Segoe Script"', 'cursive'],
      },
    },
  },
  plugins: [],
};
