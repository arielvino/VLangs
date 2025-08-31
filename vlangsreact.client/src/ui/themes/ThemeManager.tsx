import { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { baseThemeConfig, palettes, type Theme } from './Theme';

const THEME_STORAGE_KEY = 'theme';

const createAppTheme = (mode: Theme) => {
    return createTheme({
        ...baseThemeConfig,
        palette: palettes[mode],
    });
};

const ThemeModeContext = createContext<{
    mode: Theme;
    setTheme: (mode: Theme) => void;
}>({ mode: 'light', setTheme: () => { } });

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<Theme>(() => {
        return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'light';
    });

    const setTheme = (mode: Theme) => {
        setMode(mode);
        localStorage.setItem(THEME_STORAGE_KEY, mode);
    };

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    return (
        <ThemeModeContext.Provider value={{ mode, setTheme }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeModeContext.Provider>
    );
};