/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Base - using flat naming
        'dark': '#0f0f23',
        'dark-50': '#1e1e2e',
        'dark-100': '#181825',
        'dark-200': '#11111b',
        'dark-300': '#0f0f23',
        'dark-400': '#0a0a14',
        'dark-surface': '#1e1e2e',
        'dark-card': '#262638',
        'dark-hover': '#2e2e42',
        // Pop Accent Colors (Neon)
        'pop-yellow': '#fef08a',
        'pop-lime': '#a3e635',
        'pop-pink': '#f472b6',
        'pop-cyan': '#22d3ee',
        'pop-orange': '#fb923c',
        'pop-purple': '#c084fc',
        // Status Colors
        'status-live': '#22c55e',
        'status-hot': '#ef4444',
        'status-new': '#3b82f6',
        'status-urgent': '#f97316',
        // Tier Colors
        'tier-unranked': '#6b7280',
        'tier-bronze': '#cd7f32',
        'tier-silver': '#c0c0c0',
        'tier-gold': '#ffd700',
        'tier-platinum': '#22d3ee',
        'tier-diamond': '#c084fc',
        'tier-master': '#f472b6',
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
    },
  },
  plugins: [],
}
