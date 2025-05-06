/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Özel renkler eklenebilir
        'primary': {
          light: '#5eead4',
          DEFAULT: '#14b8a6',
          dark: '#0f766e',
        },
        'secondary': {
          light: '#94a3b8',
          DEFAULT: '#64748b',
          dark: '#475569',
        }
      },
      fontFamily: {
        // Özel font aileleri
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        // Özel gölge stilleri
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
