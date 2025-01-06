/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#87CEEB',    // azul claro
        secondary: '#006400',  // verde oscuro
        tertiary: '#808080',   // gris
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}