import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DarkModeTwoTone from '@mui/icons-material/DarkModeTwoTone';
import { useTheme } from '@mui/material';
import { LightModeTwoTone } from '@mui/icons-material';
import { useThemeMode } from './themes/ThemeManager'

const VLangsAppBar: React.FC = () => {
    const { toggleTheme } = useThemeMode();
    const theme = useTheme();

    return (
        <AppBar position="sticky" sx={{ bgcolor: 'background.paper', borderBottom: 0.5, borderBottomColor: 'text.secondary', borderBottomStyle: 'groove' }}>
            <Toolbar>
                <IconButton
                    color='primary'
                    sx={{ margin: 2 }}
                    onClick={() => { toggleTheme() }}>
                    {theme.palette.mode === 'dark' ? <LightModeTwoTone /> : <DarkModeTwoTone />}
                </IconButton>
                <Typography color='primary' variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    VLang
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default VLangsAppBar;