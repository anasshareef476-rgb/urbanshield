import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070B14",
          900: "#0B1220",
          800: "#121A2B",
          700: "#1A2438",
          600: "#243049",
        },
        signal: {
          amber: "#F5A524",
          coral: "#E8453C",
          teal: "#2EC4B6",
          lime: "#8FDB3A",
        },
        mist: {
          50: "#F3F6FB",
          100: "#E6ECF5",
          300: "#A8B6CC",
          400: "#7E90AB",
        },
      },
      fontFamily: {
        display: ["var(--font-teko)", "sans-serif"],
        sans: ["var(--font-figtree)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "city-grid":
          "linear-gradient(rgba(46,196,182,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(46,196,182,0.06) 1px, transparent 1px)",
        "hero-wash":
          "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(232,69,60,0.22), transparent 55%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(46,196,182,0.18), transparent 50%), linear-gradient(160deg, #070B14 0%, #0B1220 45%, #121A2B 100%)",
      },
      animation: {
        "pulse-slow": "pulse 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-up": "fadeUp 0.7s ease-out both",
        "scan-line": "scanLine 3.5s linear infinite",
        "live-blink": "liveBlink 1.4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
        liveBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
