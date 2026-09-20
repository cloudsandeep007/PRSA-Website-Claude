/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Public website palette ("Track & Podium") ─────────────────────
        // chalk   – page background, warm-neutral like a dry concrete rink
        // ink     – text and dark blocks
        // cobalt  – brand blue, the painted racing-track colour
        // race    – speed-suit yellow, used only for small accents
        // night   – floodlit-night background for dark sections
        // concrete– hairline rules and card borders on chalk
        chalk: "#F3F2EE",
        "chalk-2": "#EAE9E3",
        ink: "#0C0D10",
        "ink-2": "#16181D",
        cobalt: "#1E3DFF",
        "cobalt-deep": "#1530CC",
        race: "#FFD60A",
        night: "#0B1226",
        "night-2": "#111A36",
        concrete: "#D9D8D1",
        smoke: "#6B6E76",

        // ── Admin panel palette (Material-style tokens; unchanged) ────────
        "surface": "#051424",
        "surface-dim": "#051424",
        "surface-bright": "#2c3a4c",
        "surface-container-lowest": "#010f1f",
        "surface-container-low": "#0d1c2d",
        "surface-container": "#122131",
        "surface-container-high": "#1c2b3c",
        "surface-container-highest": "#273647",
        "on-surface": "#d4e4fa",
        "on-surface-variant": "#b9cacb",
        "inverse-surface": "#d4e4fa",
        "inverse-on-surface": "#233143",
        "outline": "#849495",
        "outline-variant": "#3b494b",
        "surface-tint": "#00dbe9",
        "primary": "#dbfcff",
        "on-primary": "#00363a",
        "primary-container": "#00f0ff",
        "on-primary-container": "#006970",
        "secondary": "#ffb4a7",
        "on-secondary": "#670500",
        "secondary-container": "#bd1100",
        "on-secondary-container": "#ffcdc4",
        "tertiary": "#f5f5ff",
        "on-tertiary": "#002a78",
        "tertiary-container": "#ced8ff",
        "on-tertiary-container": "#0053db",
        "error": "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        "background": "#051424",
        "on-background": "#d4e4fa",
        "surface-variant": "#273647"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "gutter": "1.5rem",
        "gutter-mobile": "0.75rem",
        "margin": "3rem",
        "margin-mobile": "1.25rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "space-2xl": "4rem"
      },
      fontFamily: {
        // Public website
        display: ["'Barlow Condensed'", "Impact", "sans-serif"],
        body: ["Manrope", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],

        // Admin panel (unchanged)
        "headline-xl": ["Space Grotesk", "sans-serif"],
        "headline-lg": ["Space Grotesk", "sans-serif"],
        "headline-md": ["Space Grotesk", "sans-serif"],
        "headline-sm": ["Space Grotesk", "sans-serif"],
        "display-hero": ["Space Grotesk", "sans-serif"],
        "metric-stat": ["Space Grotesk", "sans-serif"],
        "label-uppercase": ["Space Grotesk", "sans-serif"],
        "body-xl": ["Plus Jakarta Sans", "sans-serif"],
        "body-md": ["Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["Plus Jakarta Sans", "sans-serif"],
        "label-md": ["Plus Jakarta Sans", "sans-serif"]
      },
      fontSize: {
        "display-hero": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-hero-mobile": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "headline-xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "headline-lg-mobile": ["1.65rem", { lineHeight: "1.25" }],
        "headline-lg": ["2rem", { lineHeight: "1.25" }],
        "headline-md": ["1.35rem", { lineHeight: "1.3" }],
        "headline-sm": ["1.15rem", { lineHeight: "1.35" }],
        "metric-stat": ["3rem", { lineHeight: "1.1" }],
        "body-xl": ["1.15rem", { lineHeight: "1.6" }],
        "body-lg": ["1.05rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.5" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "label-uppercase": ["0.75rem", { lineHeight: "1.2" }],
        "label-md": ["0.875rem", { lineHeight: "1.2" }]
      },
      maxWidth: {
        site: "1440px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(12,13,16,0.04), 0 8px 24px -12px rgba(12,13,16,0.18)",
        lift: "0 24px 48px -20px rgba(12,13,16,0.35)",
        cobalt: "0 16px 40px -16px rgba(30,61,255,0.55)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "scroll-cue": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "translateY(14px)", opacity: "0" }
        }
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "rise-in": "rise-in 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 1.2s ease both",
        "scroll-cue": "scroll-cue 1.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
}
