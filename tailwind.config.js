/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enables dark theme toggling using a .dark class
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Theme Colors
        'sky-blue': '#E3F2FD',
        'soft-green': '#C8E6C9',
        'white': '#FFFFFF',

        // Dark Theme Colors - Enhanced Professional Theme
        'dark-bg': '#0A0E27',           // Deep navy-black background
        'dark-surface': '#1A1F3A',       // Slightly lighter surface
        'dark-surface-elevated': '#252B45', // Elevated surfaces
        'dark-border': '#2D3448',       // Subtle borders
        'accent-blue': '#64B5F6',       // Bright vibrant blue
        'accent-purple': '#9C27B0',     // Rich purple
        'accent-pink': '#E91E63',       // Vibrant pink
        'accent-green': '#4CAF50',      // Bright green
        'accent-cyan': '#00BCD4',       // Cyan accent
        
        // Additional soothing colors
        'calm-purple': '#B39BC8',
        'warm-pink': '#F8BBD0',
        'light-gray': '#F5F5F5',
      },
      backgroundImage: {
        'calm-gradient': 'linear-gradient(135deg, #E3F2FD 0%, #C8E6C9 100%)',
        'dark-gradient': 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
      },
      borderRadius: {
        'soft': '1rem',
        'softer': '1.5rem',
      },
      transitionProperty: {
        'smooth': 'all',
      },
      transitionDuration: {
        'smooth': '300ms',
      },
    },
  },
  plugins: [],
};
