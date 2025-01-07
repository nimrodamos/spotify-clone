/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        backgroundBase: '#121212', // black
        backgroundHighlight: '#1f1f1f', // dark grey
        backgroundPress: '#000', // black
        backgroundElevatedBase: '#1f1f1f', // dark grey
        backgroundElevatedHighlight: '#2a2a2a', // grey
        backgroundElevatedPress: '#191919', // very dark grey
        backgroundTintedBase: 'hsla(0, 0%, 100%, .1)', // white with opacity
        backgroundTintedHighlight: 'hsla(0, 0%, 100%, .14)', // white with opacity
        backgroundTintedPress: 'hsla(0, 0%, 100%, .21)', // white with opacity
        textBase: '#fff', // white
        textSubdued: '#b3b3b3', // light grey
        textBrightAccent: '#1ed760', // green
        textNegative: '#f3727f', // red
        textWarning: '#ffa42b', // orange
        textPositive: '#1ed760', // green
        textAnnouncement: '#4cb3ff', // blue
        essentialBase: '#fff', // white
        essentialSubdued: '#7c7c7c', // grey
        essentialBrightAccent: '#1ed760', // green
        essentialNegative: '#ed2c3f', // red
        essentialWarning: '#ffa42b', // orange
        essentialPositive: '#1ed760', // green
        essentialAnnouncement: '#4cb3ff', // blue
        decorativeBase: '#fff', // white
        decorativeSubdued: '#292929', // dark grey
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
