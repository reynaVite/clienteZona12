/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.html",
    "./src/**/*.js",
    "./src/**/*.jsx",
  ],
  theme: {
    screens:{
      'celular': '400px',
      'md': '770px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },

    colors:{
      blue_uno:'#00314A',
      white:'#fff',
      black:'#000000',
      gray:{
        100:"#B6C8C7",
        300:"#D1E0D8",
        400:"#9BB0B6",
        900:"#6D7F94"
      },
      red:"red",
      enviesss:'#00913f'
    },
    fontFamily:{
      custom:['Roboto-Light', 'sans-serif'],
    },

    extend: {},
  },
  plugins: [],
}

