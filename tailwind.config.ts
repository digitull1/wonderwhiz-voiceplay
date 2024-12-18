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
      scale: {
        '102': '1.02',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9b87f5",
          hover: "#7E69AB",
          foreground: "#1A1F2C",
        },
        secondary: {
          DEFAULT: "#33C3F0",
          foreground: "#1A1F2C",
        },
        accent: {
          DEFAULT: "#FEC6A1",
          foreground: "#1A1F2C",
        },
        chat: {
          user: "rgba(255, 255, 255, 0.95)",
          ai: "rgba(155, 135, 245, 0.95)",
        },
        block: {
          orange: "#FEC6A1",
          blue: "#33C3F0",
          purple: "#9b87f5",
        },
        app: {
          background: "#F5F5F7",
          accent: "#9b87f5",
          cta: "#FEC6A1",
          text: {
            dark: "#1A1F2C",
            light: "#F6F6F7",
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
        'sparkle': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.2s ease-out',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;