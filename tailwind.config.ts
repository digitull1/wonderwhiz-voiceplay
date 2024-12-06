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
          DEFAULT: "#8B5CF6",  // Updated to vibrant purple
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0EA5E9",  // Updated to ocean blue
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#F97316",  // Updated to bright orange
          foreground: "#ffffff",
        },
        chat: {
          user: "#F2FCE2",     // Updated to soft green
          ai: "#E5DEFF",       // Updated to soft purple
        },
        block: {
          orange: "#F97316",   // Exciting facts
          blue: "#0EA5E9",     // Exploration
          purple: "#8B5CF6",   // Mystery
        },
        reward: {
          bronze: "#CD7F32",
          silver: "#C0C0C0",
          gold: "#FFD700",
        },
        level: {
          beginner: "#4ADE80",
          intermediate: "#2563EB",
          advanced: "#8B5CF6",
          expert: "#F97316",
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'title': '24px',
        'subtitle': '20px',
        'body': '16px',
        'small': '14px',
      },
      lineHeight: {
        'relaxed': '1.5',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #EDE7F6 0%, #D7EFF7 100%)',
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
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 1.25s cubic-bezier(0.24, 0, 0.38, 1) infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "gradient": "gradient 5s ease infinite",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;