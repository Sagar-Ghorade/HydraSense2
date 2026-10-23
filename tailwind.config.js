import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

/**
 * Tailwind config union of the five reference screens
 * (stitch_pixel_perfect_ui_clone/*\/code.html). The reference markup only uses
 * default Tailwind utilities, so the extended palette below is kept for parity
 * with the original per-screen `tailwind.config` scripts.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1d72fe',
          600: '#0066ff',
          700: '#0052cc',
          blue: '#0066ff',
          dark: '#0c1a30',
          gray: '#607289',
          lightBg: '#EBF4FE',
          darkBlue: '#0066cc',
          primary: '#0d6efd',
          navy: '#0f172a',
          bg: '#f0f5fc',
          emerald: '#10b981',
          lightGreen: '#ebfbf3',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [forms, containerQueries],
}
