/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        red: '#AA261B',
        orange: '#C94800',
        white: '#FFFFFF',
        black: '#000000',
        'light-grey': '#D9D9D9',
        blue: '#1366E2',
        green: '#2CFF8',
        yellow: '#FCD1',
        'dark-blue': '#000616',

        dark: {
          text: "#FFFFFF",
          background: 'rgba(255, 255, 255, 0.06)',
          border: "rgba(86, 86, 86, 0.736)",
          hover: "rgba(255, 255, 255, 0.124)",
        },
        light: {
          background: 'rgba(17, 17, 17, 0.082)',
          text: "#000000",
          border: "rgba(203, 203, 203, 0.736)",
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'background-abstract': "url('../assets/imgs/abstract.avif')",
      },
      fontFamily: {
        segoe: ['var(--font-segoe)']
      }
    },
  },
  plugins: [],
}
