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
          DEFAULT: "#9b87f5",
          hover: "#7E69AB",
          foreground: "#1A1F2C",
          soft: "#E5DEFF",
        },
        secondary: {
          DEFAULT: "#33C3F0",
          foreground: "#1A1F2C",
          soft: "#D3E4FD",
        },
        accent: {
          DEFAULT: "#FEC6A1",
          foreground: "#1A1F2C",
          soft: "#FDE1D3",
        },
        chat: {
          user: "rgba(255, 255, 255, 0.98)",
          ai: "rgba(155, 135, 245, 0.98)",
        },
        block: {
          orange: "#FEC6A1",
          blue: "#33C3F0",
          purple: "#9b87f5",
          green: "#F2FCE2",
          yellow: "#FEF7CD",
          pink: "#FFDEE2",
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
        sans: ['OpenDyslexic', 'SF Pro Display', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'title': '32px',
        'subtitle': '26px',
        'body': '18px',
        'small': '16px',
        'block-title': '18px',
        'block-desc': '16px',
        'cta': '18px',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #F5F5F7 0%, #E5E5E7 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
        'gradient-block': 'linear-gradient(135deg, rgba(155,135,245,0.98) 0%, rgba(51,195,240,0.98) 100%)',
        'gradient-fun': 'linear-gradient(135deg, #FEC6A1 0%, #9b87f5 50%, #33C3F0 100%)',
      },
      boxShadow: {
        'luxury': '0 12px 36px -4px rgba(0, 0, 0, 0.1)',
        'card': '0 8px 16px rgba(0, 0, 0, 0.05)',
        'block': '0 12px 32px rgba(0, 0, 0, 0.1)',
        'input': '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        'sparkle': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'typing': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      },
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'pop': 'pop 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'typing': 'typing 1s ease-out',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;