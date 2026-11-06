/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: { colors: { brand: "#f68b1e", ink: "#282828", canvas: "#f5f5f5" }, boxShadow: { soft: "0 2px 12px rgba(0,0,0,.07)" } } },
  plugins: [],
};