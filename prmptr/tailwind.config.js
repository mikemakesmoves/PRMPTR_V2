module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {colors: {
      // Custom color palette
      prmptrwhite: '#dbd6cc',
      prmptroffwhite: '#d1cabf',         // Lighest Cream
      prmptrblack: '#000000',       // Black
      brown1: '#dbd6cc',          // Muted brown
      brown2: '#736355',       // brown
      brown3: '#403a35',           // darkbrown
      green1: '#B5FFB0',           // light green
      green2: '#50B449',           // green
    },
    fontFamily: {
      'permanent': ['"Permanent Marker"', 'serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    keyframes: {
      'fade-in': {
        '0%': { opacity: '.7' },
        '100%': { opacity: '1' },
      }
    },
    animation: {
      'fade-in': 'fade-in 0.5s ease-in-out',
    }
  },
  },
  plugins: [],
};