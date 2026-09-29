/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040B17',
          900: '#061225', // Deep Navy
          800: '#0B1B3A', // Primary Navy
          700: '#102A56',
          600: '#183B75',
          100: '#E4ECF7',
          50: '#F0F5FC',
        },
        cyan: {
          400: '#38D4F8',
          500: '#19BCE5', // Cyan Accent
          600: '#0EA5CC',
          700: '#0883A3',
          50: '#EAF8FC',  // Light Blue / Cyan Soft
        },
        slate: {
          750: '#233045',
          850: '#131F35',
        },
        brand: {
          navy: '#0B1B3A',
          deep: '#061225',
          cyan: '#19BCE5',
          lightBlue: '#EAF8FC',
          softGray: '#F5F7FA',
          textGray: '#5B6472',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(25, 188, 229, 0.35)',
        'glow-cyan-sm': '0 0 15px -3px rgba(25, 188, 229, 0.25)',
        'glow-navy': '0 10px 30px -10px rgba(11, 27, 58, 0.3)',
        'card': '0 4px 20px -2px rgba(11, 27, 58, 0.05)',
        'card-hover': '0 20px 35px -5px rgba(11, 27, 58, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-mesh': 'radial-gradient(circle at 50% 0%, rgba(25, 188, 229, 0.15) 0%, rgba(11, 27, 58, 0) 70%)',
      }
    },
  },
  plugins: [],
}
