
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
        // Design System Cataldo Siston v2.1 (CORRIGIDO 2026-01-20)
        primary: {
          DEFAULT: "#d68e08",         // Dourado - CTAs e destaques
          dark: "#b87a07",            // Dourado escuro - hover
          light: "#f4a82a",           // Dourado claro
        },
        secondary: "#333333",          // Cinza escuro - texto secundário
        background: "#ffffff",         // Fundo principal
        
        // Tons de Grafite (paleta principal do site)
        grafite: {
          DEFAULT: "#191919",          // Texto principal, início de gradientes
          medio: "#464646",            // Final de gradientes, cards de destaque
          claro: "#3c3c3c",            // Top bar
        },
        
        // Tons de cinza
        'dark-gray': "#191919",        // Texto principal
        'gray-dark': "#333333",        // Texto secundário
        'gray-medium': "#4a4a4a",      // Texto terciário
        
        // Tons claros
        'cream': "#ebe5de",            // Bege claro - seções alternadas
        'off-white': "#fdfdfd",        // Background suave
        
        // Footer
        'footer': "#32373c",           // Background do footer
        
        // Semânticas
        'whatsapp': "#53a451",         // Botão WhatsApp
        
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
