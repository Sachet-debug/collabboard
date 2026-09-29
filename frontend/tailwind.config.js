/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C2321",
        canvas: "#F7F7F5",
        accent: "#3D5A80",
        accentDark: "#2E4560",
        line: "#E4E4DF",
      },
    },
  },
  plugins: [],
};
