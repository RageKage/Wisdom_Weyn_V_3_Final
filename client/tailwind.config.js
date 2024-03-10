// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        seashell: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#dcdcdc',
          300: '#bdbdbd',
          400: '#989898',
          500: '#7c7c7c',
          600: '#656565',
          700: '#525252',
          800: '#464646',
          900: '#3d3d3d',
          950: '#292929',
        },

        saffron: {
          50: '#fdfae9',
          100: '#fbf3c6',
          200: '#f8e590',
          300: '#f3cf51',
          400: '#eebb2a',
          500: '#dea114',
          600: '#bf7c0f',
          700: '#985810',
          800: '#7e4715',
          900: '#6c3a17',
          950: '#3f1d09',
        },

        carrotOrange: {
          50: '#fef9ee',
          100: '#fcf1d8',
          200: '#f8e0b0',
          300: '#f4c97d',
          400: '#eea849',
          500: '#eb932e',
          600: '#db751b',
          700: '#b65a18',
          800: '#91471b',
          900: '#753b19',
          950: '#3f1c0b',
        },

        redDamask: {
          50: '#fef5ee',
          100: '#fcead8',
          200: '#f7d0b1',
          300: '#f2af7f',
          400: '#ec844b',
          500: '#e86b32',
          600: '#d84c1e',
          700: '#b3381b',
          800: '#8f2e1d',
          900: '#74281a',
          950: '#3e120c',
        },
        cinnabar: {
          50: '#fdf4f3',
          100: '#fde5e3',
          200: '#fcd0cc',
          300: '#f8afa9',
          400: '#f28077',
          500: '#e54437',
          600: '#d43a2e',
          700: '#b22e23',
          800: '#942920',
          900: '#7b2821',
          950: '#42110d',
        },
      },
      height: {
        128: '32rem',
      },
      fontFamily: {
        Kalam: ['Kalam', 'sans-serif'],
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('@tailwindcss/forms')],
}
