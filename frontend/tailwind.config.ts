import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#07090e',
                foreground: '#f8fafc',
                
                // Palette Obsidian Slate Fintech
                surface: {
                    DEFAULT: '#0d121f',
                    card: '#0f1626',
                    muted: '#151d30',
                    border: 'rgba(255, 255, 255, 0.08)',
                    highlight: 'rgba(255, 255, 255, 0.03)'
                },

                // Rétrocompatibilité & Brand
                'brand-bg': '#07090e',
                'brand-card': '#0f1626',
                'brand-primary': '#2563eb',
                'brand-secondary': '#4f46e5',
                'brand-text-dim': '#94a3b8',
                'brand-border': 'rgba(255, 255, 255, 0.08)',

                primary: {
                    DEFAULT: '#2563eb',
                    hover: '#1d4ed8',
                    subtle: 'rgba(37, 99, 235, 0.12)',
                },
                secondary: {
                    DEFAULT: '#4f46e5',
                    subtle: 'rgba(79, 70, 229, 0.12)',
                },
                accent: {
                    DEFAULT: '#0284c7',
                    cyan: '#06b6d4',
                    emerald: '#10b981',
                },
                border: 'rgba(255, 255, 255, 0.08)',
                input: '#0d121f',
                ring: '#2563eb',
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
            boxShadow: {
                'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
                'glow-primary': '0 0 30px -5px rgba(37, 99, 235, 0.25)',
                'glow-accent': '0 0 30px -5px rgba(6, 182, 212, 0.25)',
                'card': '0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
            },
            animation: {
                'fade-in': 'fadeIn 0.25s ease-out forwards',
                'slide-in': 'slideIn 0.25s ease-out forwards',
                'pulse-slow': 'pulseGlow 4s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-12px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.05)' },
                },
            },
        },
    },
    plugins: [],
}

export default config
