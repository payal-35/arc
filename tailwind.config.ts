import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "border-border",
    "border-input",
    "ring-ring",
    "bg-background",
    "text-foreground",
    "bg-card",
    "text-card-foreground",
    "bg-popover",
    "text-popover-foreground",
    "bg-primary",
    "text-primary-foreground",
    "bg-secondary",
    "text-secondary-foreground",
    "bg-muted",
    "text-muted-foreground",
    "bg-accent",
    "text-accent-foreground",
    "bg-destructive",
    "text-destructive-foreground",
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
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    

 keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  scaleIn: {
    '0%': { opacity: '0', transform: 'scale(0.95)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  pulseScale: {
    '0%, 100%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
  },
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' },
  },


      
    "accordion-up": {
      from: { height: "var(--radix-accordion-content-height)" },
      to: { height: "0" },
    },
    float: {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-4px)" },
    },
    
    zoom: {
      "0%, 100%": { transform: "scale(1)" },
      "50%": { transform: "scale(1.15)" },
    },
  },
  animation: {
    pulseScale: "pulseScale 10 ease-in-out infinite",
    "accordion-down": "accordion-down 0.2s ease-out",
    "accordion-up": "accordion-up 0.2s ease-out",
    "float-0": "float 6s ease-in-out infinite",
    "float-1": "float 7s ease-in-out infinite",
    "float-2": "float 8s ease-in-out infinite",
    'fade-in': 'fadeIn 0.8s ease-out both',
    
        'slide-up': 'slideUp 0.6s ease-out both',
        'pulse-slow': 'pulse 2s infinite',
    fadeIn: 'fadeIn 0.5s ease-in',
    scaleIn: 'scaleIn 0.3s ease-out',
    zoom: "zoom 4s ease-in-out infinite",
    
    "float": "float 8s ease-in-out infinite",

  },
},    },
  
  plugins: [animate],
};

export default config;
