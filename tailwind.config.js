/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {
    colors: {
      ink: '#090e19', panel: '#111a2a', panel2: '#151f31',
      line: '#263349', muted: '#8d9bb2', mint: '#37d6a0',
      danger: '#fb7185', gold: '#f5c76b'
    },
    boxShadow: { glow: '0 0 35px rgba(55,214,160,.10)' }
  }},
  plugins: []
}