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
          DEFAULT: "#8B5CF6",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0EA5E9",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#F97316",
          foreground: "#ffffff",
        },
        chat: {
          user: "#F2FCE2",
          ai: "#E5DEFF",
        },
        block: {
          orange: "#F97316",
          blue: "#0EA5E9",
          purple: "#8B5CF6",
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
        'block-title': '18px',
        'block-desc': '16px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'mobile-input': '90vw',
      },
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-bottom))',
      },
      boxShadow: {
        'block': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'block-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;