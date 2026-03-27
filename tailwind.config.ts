import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      'dark-950': '#0a0a0a',
      'dark-900': '#111111',
      'dark-800': '#1a1a1a',
      'dark-700': '#252525',
      'accent-primary': '#7c3aed',
      'accent-secondary': '#06b6d4',
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      'gray-300': '#d1d5db',
      'gray-400': '#9ca3af',
      'gray-500': '#6b7280',
      'gray-600': '#4b5563',
      'gray-800': '#1f2937',
    },
    extend: {
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '3840px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          lg: '2rem',
          '3xl': '3rem',
        },
      },
      // Make some common max-widths and spacing fluid so layout scales on very large screens
      maxWidth: {
        '3xl': 'clamp(48rem, 6vw + 2rem, 86rem)',
        '4xl': 'clamp(56rem, 8vw + 2rem, 110rem)',
        '5xl': 'clamp(64rem, 10vw + 2rem, 130rem)',
        '6xl': 'clamp(72rem, 12vw + 2rem, 150rem)',
        '7xl': 'clamp(80rem, 14vw + 2rem, 170rem)',
      },
      spacing: {
        '96': 'clamp(4.5rem, 3.5vw + 1rem, 9rem)',
        '80': 'clamp(3.5rem, 3vw + 1rem, 7.5rem)',
        '72': 'clamp(3rem, 2.5vw + 0.75rem, 6.5rem)',
        '56': 'clamp(2.5rem, 2vw + 0.5rem, 4.5rem)',
        '44': 'clamp(2rem, 1.6vw + 0.4rem, 3.5rem)',
        '36': 'clamp(1.5rem, 1.2vw + 0.2rem, 2.5rem)'
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.6)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
