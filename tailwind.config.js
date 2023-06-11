/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    container:{
      center: true
    },
    extend: {
      spacing: {
        "1": "1rem",
        "2": "2rem",
        "3": "3rem",
        "4": "4rem",
        "5": "5rem",
        "6": "6rem",
        "7": "7rem",
        "8": "8rem",
        "9": "9rem",
        "10": "10rem",
        "11": "11rem",
        "12": "12rem",
        "13": "13rem",
        "14": "14rem",
        "15": "15rem",
        "16": "16rem",
        "17": "17rem",
        "18": "18rem",
        "19": "19rem",
        "20": "20rem",
      },
      colors:{
        violet: "#6e40c9",
        gray: "#80808052",
        darkGray: "#0d1117",
        lightOrange: "#ffa28b"
      }
    },
  },
  plugins: [],
}
