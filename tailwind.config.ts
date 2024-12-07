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
          DEFAULT: "#007AFF", // iOS Blue
          hover: "#0063CC",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#5856D6", // iOS Purple
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#FF2D55", // iOS Pink
          foreground: "#ffffff",
        },
        chat: {
          user: "rgba(255, 255, 255, 0.95)",
          ai: "rgba(0, 122, 255, 0.95)", // iOS Blue with opacity
        },
        block: {
          orange: "#FF9500", // iOS Orange
          blue: "#007AFF", // iOS Blue
          purple: "#5856D6", // iOS Purple
        },
        app: {
          background: "#F5F5F7", // Apple Light Gray
          accent: "#5856D6", // iOS Purple
          cta: "#FF2D55", // iOS Pink
          text: {
            dark: "#1D1D1F", // Apple Dark Gray
            light: "#FFFFFF",
          }
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['GT Super Display', 'Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'title': '32px',
        'subtitle': '28px',
        'body': '18px',
        'small': '16px',
        'block-title': '20px',
        'block-desc': '16px',
        'cta': '18px',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        'gradient-block': 'linear-gradient(135deg, rgba(0,122,255,0.95) 0%, rgba(88,86,214,0.95) 100%)',
        'stars': 'url("/stars-pattern.svg")',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%': { opacity: '0.5', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '0.5', transform: 'scale(0.95)' },
        },
        'sparkle': {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1) rotate(180deg)', opacity: '0.8' },
          '100%': { transform: 'scale(0) rotate(360deg)', opacity: '0' },
        },
        'typing': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'typing': 'typing 3s steps(40, end)',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      boxShadow: {
        'luxury': '0 8px 32px -4px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'block': '0 8px 24px rgba(0, 0, 0, 0.1)',
        'input': '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;