import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f5f5f5',
            paper: '#fff',
        },
        text: {
            primary: '#000',
        },
        primary: {
            main: '#fbc803',
        },
        secondary: {
            main: '#0088ff',
        },
    },
});
