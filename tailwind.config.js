/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grade: {
          normal: "#4d5055",
          bronze: "#d38763",
          silver: "#d3d6dc",
          gold: "#f3cf3e",
        },
        gradetitle: {
          normal: "#c6c6c6",
          bronze: "#733c2a",
          silver: "#5c626c",
          gold: "#634e00",
        },
        position: {
          fw: "#ee0045",
          mf: "#5aaa71",
          df: "#1a338d",
        },
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text|border)-(grade|gradetitle|position|)/,
    },
  ],
};
