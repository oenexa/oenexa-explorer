/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oenexa: {
          green: "#39d353",
          bg: "#0d1117",
          panel: "#161b22",
          border: "#30363d",
        }
      }
    },
  },
  plugins: [],
}
