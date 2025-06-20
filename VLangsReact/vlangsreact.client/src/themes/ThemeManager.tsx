import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createTheme, ThemeProvider, type PaletteOptions } from '@mui/material/styles';

const THEME_STORAGE_KEY = 'theme';

type Theme = 'light' | 'dark';

// Define your color palettes
const palettes: Record<Theme, PaletteOptions> = {
    light: {
        mode: 'light',
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#dc004e',
            light: '#ff5983',
            dark: '#9a0036',
        },
        background: {
            default: '#ffffff',
            paper: '#f5f5f5',
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
            main: '#aa00bb',
        },
        secondary: {
            main: '#00ccff',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#999999',
        },
        divider: '#333333',
    },
};

const baseThemeConfig = {
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

const createAppTheme = (mode: Theme) => {
    return createTheme({
        ...baseThemeConfig,
        palette: palettes[mode],
    });
};

const ThemeModeContext = createContext<{
    mode: Theme;
    toggleTheme: () => void;
}>({ mode: 'light', toggleTheme: () => { } });

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<Theme>(() => {
        return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'light';
    });

    const toggleTheme = () => {
        setMode((prev) => {
            const next = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem(THEME_STORAGE_KEY, next);
            return next;
        });
    };

    const theme = useMemo(() => createTheme({ palette: palettes[mode] }), [mode]);

    return (
        <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeModeContext.Provider>
    );
};