// tailwind.config.js
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // ...
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0, visibility: "hidden" },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease-out",
        fadeOut: "fadeOut 2.5s 2s forwards",
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("@tailwindcss/typography"),
    require('autoprefixer'),
    nextui({
      themes: {
        light: {
          colors: {
            default: {
              DEFAULT: "#687EFF",
              foreground: "#333",
            },
            primary: {
              DEFAULT: "#164863",
              foreground: "#fff",
            },
            secondary: {
              DEFAULT: "#427D9D",
              foreground: "#E4EBF3",
            },
            success: {
              DEFAULT: "#539165",
              foreground: "#E4EBF3",
            },
            content1: {
              DEFAULT: "#ebebed",
              foreground: "#040E32",
            },
            content2: {
              DEFAULT: "#9BBEC8",
              foreground: "#333",
            },
            content3: {
              DEFAULT: "#646464",
              foreground: "#fff",
            },
            content4: {
              DEFAULT: "#d9d7d7",
              foreground: "#000",
            },
            background: {
              DEFAULT: "#E4EBF3",
              foreground: "#333",
            },
            foreground: "#333",
          },
        },
      },
    }),
  ],
};

export default config;
