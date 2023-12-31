module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}",  "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {            
        'custom-purple': {
          50: '#FAF4FF',
          100: '#F3E6FF',
          200: '#EAD2FF',
          300: '#D9AEFF',
          400: '#C27BFF',
          500: '#AB49FF', 
          600: '#9825F8',
          700: '#8315DB',
          800: '#6F17B2',
          900: '#5B148F',
          950: '#4B0082',
        },
        'custom-gold': {
          50: '#FFFFE7',
          100: '#FEFFC1',
          200: '#FFFD86',
          300: '#FFF441',
          400: '#FFE60D',
          500: '#FFD700', 
          600: '#D19E00',
          700: '#A67102',
          800: '#89580A',
          900: '#74480F',
          950: '#442604',
        },
        customBlue: "#51CBEE",
      },
      height: {
        '128': '32rem',
      }
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('flowbite/plugin')
  ]
  
};
