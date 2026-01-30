import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: [
          "Pretendard",
          "-apple-system",
          "Roboto",
          "Helvetica",
          "sans-serif",
        ],
        serif: ["Noto Serif KR", "serif"],
      },
      lineClamp: {
        8: "8",
        9: "9",
        10: "10",
      },
      colors: {
        background: "var(--background)",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--white))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--primary))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--primary))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--orange-02))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
        },
        light: {
          DEFAULT: "hsl(var(--light))",
          foreground: "hsl(var(--gray-03))",
          md: {
            DEFAULT: "#D2D2D2",
            foreground: "hsl(var(--gray-03))",
          },
          sm: {
            DEFAULT: "#B2B2B2",
            foreground: "hsl(var(--gray-03))",
          },
        },
        cancle: {
          DEFAULT: "hsl(var(--cancle))",
          foreground: "hsl(var(--gray-03))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        black: "hsl(var(--black))",
        white: "hsl(var(--white))",
        red: {
          DEFAULT: "hsl(var(--red))",
          1: "hsl(var(--red-01))",
          2: "hsl(var(--red-02))",
          3: "hsl(var(--red-03))",
        },
        orange: {
          1: "hsl(var(--orange-01))",
          2: "hsl(var(--orange-02))",
          3: "hsl(var(--orange-03))",
          4: "hsl(var(--orange-04))",
        },
        gray: {
          1: "hsl(var(--gray-01))",
          2: "hsl(var(--gray-02))",
          3: "hsl(var(--gray-03))",
          4: "hsl(var(--gray-04))",
          5: "hsl(var(--gray-05))",
          6: "hsl(var(--gray-06))",
          7: "hsl(var(--gray-07))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
