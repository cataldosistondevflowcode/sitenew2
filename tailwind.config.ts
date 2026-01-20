
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
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        'body': ['Quicksand', 'Arial', 'Verdana', 'sans-serif'],
      },
      colors: {
        // Cores do Design System Cataldo Siston
        primary: "#d68e08",           // Dourado - CTAs e destaques
        secondary: "#333333",          // Cinza escuro - texto secundário
        background: "#f5f5f5",         // Fundo suave
        'dark-green': "#265c54",       // Verde escuro - headers/seções
        'cream': "#ebe5de",            // Bege claro - seções alternadas
        'dark-gray': "#191919",        // Texto principal
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
