import type { PaletteOptions } from "@mui/material";

export type Theme = 'light' | 'dark';

export const palettes: Record<Theme, PaletteOptions> = {
    light: {
        mode: 'light',
        primary: {
            main: '#6366F1', // Rich indigo
            dark: '#4338CA',
            light: '#818CF8',
        },
        secondary: {
            main: '#14B8A6', // Vibrant teal
            dark: '#0F766E',
            light: '#5EEAD4',
        },
        background: {
            default: '#F8F9FF', // Soft blue-white
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1E293B',
            secondary: '#64748B',
        },
        success: {
            main: '#10B981', // Emerald
        },
        error: {
            main: '#EF4444', // Red
        },
        divider: '#E2E8F0',
    },
    dark: {
        mode: 'dark',
        primary: {
            main: '#A78BFA', // Soft purple
            dark: '#7C3AED',
            light: '#C4B5FD',
        },
        secondary: {
            main: '#2DD4BF', // Bright teal
            dark: '#14B8A6',
            light: '#5EEAD4',
        },
        background: {
            default: '#0F172A', // Deep navy
            paper: '#1E293B', // Slate
        },
        text: {
            primary: '#F1F5F9',
            secondary: '#94A3B8',
        },
        success: {
            main: '#34D399', // Bright emerald
        },
        error: {
            main: '#F87171', // Bright red
        },
        divider: '#334155',
    },
};

export const baseThemeConfig = {
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 500,
            lineHeight: 1.4,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 8,
    },
    spacing: 8,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    overflowX: 'hidden',
                    maxWidth: '100vw',
                },
                html: {
                    overflowX: 'hidden',
                    maxWidth: '100vw',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none' as const,
                    fontWeight: 500,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                },
            },
        },
    },
};