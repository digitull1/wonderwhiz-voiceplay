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
          DEFAULT: "#8B5CF6", // Vibrant purple that's engaging but not overwhelming
          hover: "#7C3AED",
          foreground: "#FFFFFF",
          soft: "#EDE9FE",
        },
        secondary: {
          DEFAULT: "#0EA5E9", // Friendly blue that suggests trust and calmness
          foreground: "#FFFFFF",
          soft: "#E0F2FE",
        },
        accent: {
          DEFAULT: "#F97316", // Energetic orange for important elements
          foreground: "#FFFFFF",
          soft: "#FFEDD5",
        },
        chat: {
          user: "rgba(255, 255, 255, 0.98)",
          ai: "rgba(139, 92, 246, 0.98)", // Using primary color for consistency
        },
        block: {
          orange: "#F97316", // Energetic
          blue: "#0EA5E9",   // Calming
          purple: "#8B5CF6", // Playful
          green: "#10B981",  // Growth
          yellow: "#FBBF24", // Joy
          pink: "#EC4899",   // Fun
        },
        app: {
          background: "#F8FAFC", // Softer background that's easier on the eyes
          accent: "#8B5CF6",
          cta: "#F97316",
          text: {
            dark: "#1E293B",  // Softer than pure black
            light: "#F8FAFC", // Optimized for readability
          }
        }
      },
      fontFamily: {
        sans: ['OpenDyslexic', 'SF Pro Display', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'title': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'subtitle': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'small': ['1rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'block-title': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'block-desc': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'cta': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #F8FAFC 0%, #EDE9FE 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
        'gradient-block': 'linear-gradient(135deg, rgba(139,92,246,0.98) 0%, rgba(14,165,233,0.98) 100%)',
        'gradient-fun': 'linear-gradient(135deg, #F97316 0%, #8B5CF6 50%, #0EA5E9 100%)',
      },
      boxShadow: {
        'luxury': '0 12px 36px -4px rgba(139, 92, 246, 0.15)',
        'card': '0 8px 16px rgba(139, 92, 246, 0.08)',
        'block': '0 12px 32px rgba(139, 92, 246, 0.12)',
        'input': '0 4px 12px rgba(139, 92, 246, 0.08)',
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