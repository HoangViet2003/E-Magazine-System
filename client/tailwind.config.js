/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: { BeVietnamPro: "Be Vietnam Pro, Roboto Mono" },

    screens: {
      sm: "375px",
      md: "576px",
      lg: "768px",
      xl: "1024px",
      "2xl": "1280px",
      "3xl": "1536px",
    },
    container: {
      screens: {
        sm: "375px",
        md: "576px",
        lg: "768px",
        xl: "1024px",
        "2xl": "1280px",
        "3xl": "1536px",
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
        borderColor: "#E7E7ED",
        activeTabBg: "#F0F5FF",
        activeTabContent: "#004AD7",
      },
      dropShadow: {
        "3xl": "0 35px 35px rgba(0, 0, 0, 0.25)",
        "4xl": [
          "0 35px 35px rgba(0, 0, 0, 0.25)",
          "0 45px 65px rgba(0, 0, 0, 0.15)",
        ],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
