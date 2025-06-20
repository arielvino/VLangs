import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#fff',
        },
        primary: {
            main: '#fbc803',
        },
        secondary: {
            main: '#0088ff',
        },
    },
});
