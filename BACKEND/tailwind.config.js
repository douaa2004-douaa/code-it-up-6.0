/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bubble: ['"Fredoka One"', 'cursive'],
        body:   ['"Nunito"', 'sans-serif'],
        mono:   ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
