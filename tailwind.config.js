/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0E14',
        surface: '#121820',
        surface2: '#1A2232',
        surface3: '#202C3E',
        border: 'rgba(255,255,255,0.06)',
        'accent-blue': '#4A9EFF',
        'accent-mint': '#34D399',
        'accent-violet': '#A78BFA',
        'accent-amber': '#FBBF24',
        'accent-rose': '#FB7185',
        'accent-coral': '#F97316',
        'accent-sky': '#38BDF8',
        'text-primary': '#F0F4FF',
        'text-secondary': '#8899AA',
        'text-muted': '#4A5568',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Google Sans"', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 2px 20px rgba(0,0,0,0.4)',
        'glow-blue': '0 0 20px rgba(74,158,255,0.15)',
        'glow-mint': '0 0 20px rgba(52,211,153,0.15)',
        'glow-violet': '0 0 20px rgba(167,139,250,0.15)',
      }
    },
  },
  plugins: [],
}
