/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          navy: '#142B4A',
          'navy-dark': '#0F1F38',
          'navy-light': '#1E3A5F',
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          'blue-light': '#EFF6FF',
          'blue-soft': '#DBEAFE',
          bg: '#F8FAFC',
          text: '#172B4D',
          muted: '#64748B',
          border: '#E2E8F0',
          card: '#FFFFFF',
          success: '#16A34A',
          warning: '#D97706',
          error: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
