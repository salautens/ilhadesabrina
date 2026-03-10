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
        skin: "#F2EDE8",
        steel: "#C8BFB5",
        shadow: "#3D3530",
        amber: "#C17F3A",
        "skin-2": "#E8E0D8",
        "shadow-2": "#1A1410",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "9999px",
      },
      letterSpacing: {
        widest: "0.4em",
        ultra: "0.6em",
      },
      gridTemplateColumns: {
        "cyber": "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
      },
    },
  },
  plugins: [],
};

export default config;
