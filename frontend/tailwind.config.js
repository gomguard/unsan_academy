/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Base
        dark: {
          DEFAULT: '#0f0f23',
          50: '#1e1e2e',
          100: '#181825',
          200: '#11111b',
          300: '#0f0f23',
          400: '#0a0a14',
          surface: '#1e1e2e',
          card: '#262638',
          hover: '#2e2e42',
        },
        // Pop Accent Colors (Neon)
        pop: {
          yellow: '#fef08a',      // Neon Yellow
          lime: '#a3e635',        // Electric Lime
          pink: '#f472b6',        // Hot Pink
          cyan: '#22d3ee',        // Cyan
          orange: '#fb923c',      // Bright Orange
          purple: '#c084fc',      // Electric Purple
        },
        // Primary (Yellow accent like Nomad)
        primary: {
          DEFAULT: '#fef08a',
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
        // Tier Colors (Gamified)
        tier: {
          unranked: '#6b7280',
          bronze: '#cd7f32',
          silver: '#c0c0c0',
          gold: '#ffd700',
          platinum: '#22d3ee',
          diamond: '#c084fc',
          master: '#f472b6',
        },
        // Status Colors
        status: {
          live: '#22c55e',
          hot: '#ef4444',
          new: '#3b82f6',
          urgent: '#f97316',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pop': '4px 4px 0px 0px rgba(254, 240, 138, 0.3)',
        'pop-lg': '6px 6px 0px 0px rgba(254, 240, 138, 0.4)',
        'pop-pink': '4px 4px 0px 0px rgba(244, 114, 182, 0.4)',
        'pop-cyan': '4px 4px 0px 0px rgba(34, 211, 238, 0.4)',
        'glow-yellow': '0 0 20px rgba(254, 240, 138, 0.3)',
        'glow-pink': '0 0 20px rgba(244, 114, 182, 0.3)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'ticker': 'ticker 20s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
