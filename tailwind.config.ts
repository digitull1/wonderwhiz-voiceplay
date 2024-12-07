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
          DEFAULT: "#9b87f5", // Lavender
          hover: "#7E69AB",
          foreground: "#1A1F2C", // Dark text for contrast
        },
        secondary: {
          DEFAULT: "#33C3F0", // Teal
          foreground: "#1A1F2C",
        },
        accent: {
          DEFAULT: "#FEC6A1", // Coral
          foreground: "#1A1F2C",
        },
        chat: {
          user: "rgba(255, 255, 255, 0.95)",
          ai: "rgba(155, 135, 245, 0.95)", // Lavender with opacity
        },
        block: {
          orange: "#FEC6A1", // Coral
          blue: "#33C3F0", // Teal
          purple: "#9b87f5", // Lavender
        },
        app: {
          background: "#F5F5F7", // Light background
          accent: "#9b87f5", // Lavender
          cta: "#FEC6A1", // Coral
          text: {
            dark: "#1A1F2C", // Dark text
            light: "#F6F6F7", // Light text
          }
        }
      },
      fontFamily: {
        sans: ['SF Pro Display', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'title': '28px',
        'subtitle': '24px',
        'body': '16px',
        'small': '14px',
        'block-title': '16px',
        'block-desc': '14px',
        'cta': '16px',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #F5F5F7 0%, #E5E5E7 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        'gradient-block': 'linear-gradient(135deg, rgba(155,135,245,0.95) 0%, rgba(51,195,240,0.95) 100%)',
      },
      boxShadow: {
        'luxury': '0 8px 32px -4px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'block': '0 8px 24px rgba(0, 0, 0, 0.1)',
        'input': '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;