/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1B5E20',
        'primary-light': '#2E7D32',
        'primary-muted': '#C8E6C9',
        'primary-surface': '#F1F8E9',
        accent: '#F9A825',
        'accent-light': '#FFF8E1',
        trust: '#1565C0',
        'trust-light': '#E3F2FD',
      },
    },
  },
  plugins: [],
};
