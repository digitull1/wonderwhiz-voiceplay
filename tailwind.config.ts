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
          DEFAULT: "#BFAAFF",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#38C9C9",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#FF6F61",
          foreground: "#ffffff",
        },
        chat: {
          user: "#F5F5F5",
          ai: "#E8E8FF",
        },
        block: {
          orange: "#FF6F61",
          blue: "#38C9C9",
          purple: "#BFAAFF",
        },
        reward: {
          bronze: "#CD7F32",
          silver: "#C0C0C0",
          gold: "#FFDD57",
        },
        level: {
          beginner: "#4ADE80",
          intermediate: "#2563EB",
          advanced: "#BFAAFF",
          expert: "#FF6F61",
        },
        app: {
          background: "#E8E8FF",
          accent: "#38C9C9",
          cta: "#FFDD57",
          text: {
            dark: "#333333",
            light: "#FFFFFF",
          }
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
        'block-title': '18px',
        'block-desc': '16px',
        'cta': '20px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'mobile-input': '90vw',
        'block-height': '80vh',
      },
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-bottom))',
      },
      minHeight: {
        'touch': '48px',
      },
      boxShadow: {
        'block': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'block-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'chat': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'chat-hover': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      lineHeight: {
        'readable': '1.6',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'chat-ai': 'linear-gradient(135deg, #E8E8FF 0%, #F4F4FF 50%, #FFFFFF 100%)',
        'chat-user': 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 100%)',
        'input-box': 'linear-gradient(to right, #F4F4FF, #FFFFFF)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.25s cubic-bezier(0.24, 0, 0.38, 1) infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;