/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      screens: {
        sm: "400px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      maxWidth: {
        desktop: "1440px",
      },
      colors: {
        logoText: "#6B6C7E",
        searchBackground: "#F1F2F5",
        defaultTextColor: "#272833",
      },
    },
  },
  plugins: [],
};
