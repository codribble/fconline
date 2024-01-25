/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grade: {
          normal: {
            DEFAULT: "#4d5055",
            title: "#c6c6c6",
          },
          gold: {
            DEFAULT: "#f3cf3e",
            title: "#634e00",
          },
          silver: {
            DEFAULT: "#d3d6dc",
            title: "#5c626c",
          },
          bronze: {
            DEFAULT: "#d38763",
            title: "#733c2a",
          },
        },
        position: {
          fw: {
            DEFAULT: "#ee0045",
          },
          mf: {
            DEFAULT: "#5aaa71",
          },
          df: {
            DEFAULT: "#1a338d",
          },
        },
      },
    },
  },
  plugins: [],
};
