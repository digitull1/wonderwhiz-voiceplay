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
          DEFAULT: "#9b87f5", // Soft Purple - Calming and engaging
          hover: "#7E69AB",
          foreground: "#1A1F2C", // Dark text for contrast
        },
        secondary: {
          DEFAULT: "#33C3F0", // Sky Blue - Promotes creativity
          foreground: "#1A1F2C",
        },
        accent: {
          DEFAULT: "#FEC6A1", // Soft Peach - Warm and inviting
          foreground: "#1A1F2C",
        },
        chat: {
          user: "rgba(255, 255, 255, 0.95)",
          ai: "rgba(155, 135, 245, 0.95)", // Soft Purple with opacity
        },
        block: {
          orange: "#FEC6A1", // Soft Peach
          blue: "#33C3F0",   // Sky Blue
          purple: "#9b87f5", // Soft Purple
        },
        app: {
          background: "#F5F5F7", // Light, neutral background
          accent: "#9b87f5",     // Soft Purple
          cta: "#FEC6A1",        // Soft Peach
          text: {
            dark: "#1A1F2C",     // High contrast for readability
            light: "#F6F6F7",    // Light text
          }
        }
      },
      keyframes: {
        'sparkle': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;