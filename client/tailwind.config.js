/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        myXl: "1450px",
        mylg: "1350px",
        mylg2: "1295px",
        mylg3: "1240px",
        mylg4: "1200px",
        mylg5: "1140px",
        mymd: "1070px",
        mymd2: "1000px",
      },
      fontFamily: {
        roboto: "Roboto",
      },
    },
  },
  plugins: [],
};
