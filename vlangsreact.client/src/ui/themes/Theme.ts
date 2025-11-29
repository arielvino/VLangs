import type { PaletteOptions } from "@mui/material";

export type Theme = 'light' | 'dark';

export const palettes: Record<Theme, PaletteOptions> = {
    light: {
        mode: 'light',
        primary: {
            //main: '#cc00ff',
            main: '#3333ff',
        },
        secondary: {
            //main: '#008888',
            main: '#00ccff',
        },
        background: {
            default: '#bbccff',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#666666',
        },
        divider: '#e0e0e0',
    },
    dark: {
        mode: 'dark',
        primary: {
            main: '#cc00ff',
        },
        secondary: {
            main: '#00ccff',
        },
        background: {
            default: '#121212',
            paper: '#2e2e2e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#999999',
        },
        divider: '#333333',
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