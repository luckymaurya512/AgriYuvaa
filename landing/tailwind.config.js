/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#111111",
          green: "#7CB342",
          "green-dark": "#4C7A2A",
          "green-light": "#E9F3DE",
          grey: "#666666",
          surface: "#F5F6F2",
          border: "#E2E4DD",
        },
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
