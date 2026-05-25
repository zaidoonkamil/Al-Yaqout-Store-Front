import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yaqut: {
          primary: "#1E0D45",
          dark:    "#0D0720",
          purple:  "#5B21B6",
          gold:    "#C9A227",
          goldLight: "#F0C040",
          bg:      "#FDF8EF",
          card:    "#FFFFFF",
          muted:   "#6B7280",
        },
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A227 0%, #F0C040 50%, #C9A227 100%)",
        "purple-gradient": "linear-gradient(135deg, #1E0D45 0%, #5B21B6 100%)",
        "hero-gradient": "linear-gradient(180deg, #1E0D45 0%, #2D1B69 100%)",
      },
      boxShadow: {
        card: "0 2px 16px rgba(30, 13, 69, 0.07)",
        "card-hover": "0 6px 28px rgba(30, 13, 69, 0.14)",
        gold: "0 4px 15px rgba(201, 162, 39, 0.3)",
        nav: "0 -2px 24px rgba(30,13,69,0.10)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
