import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Lexend", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Brand tokens layered on top of Tailwind's default palette
        // (the UI components use slate/amber/emerald/indigo/rose/orange/stone directly)
        brand: {
          navy: "#0f172a",   // slate-900 — primary dark / header bg
          amber: "#fbbf24",  // amber-400 — primary accent / CTA
          emerald: "#10b981",// emerald-500 — success / progress
          teal: "#0d9488",   // teal-600 — offline / accessibility accent
          rose: "#f43f5e",   // rose-500 — alerts / weak-area flags
        },
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
