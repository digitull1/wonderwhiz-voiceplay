import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF6B6B",  // Playful coral red
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#4ECDC4",  // Bright turquoise
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#FFD93D",  // Sunny yellow
          foreground: "#000000",
        },
        success: {
          DEFAULT: "#95E1D3",  // Soft mint
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#A8E6CF",  // Light sage
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#FFB347",  // Warm orange
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        sans: ['Comic Sans MS', 'Chalkboard SE', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1)", opacity: "0.4" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 1.25s cubic-bezier(0.24, 0, 0.38, 1) infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;