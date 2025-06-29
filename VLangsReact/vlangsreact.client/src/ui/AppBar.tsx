import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DarkModeTwoTone from '@mui/icons-material/DarkModeTwoTone';
import { Box, Button, useTheme } from '@mui/material';
import { LightModeTwoTone } from '@mui/icons-material';
import { useThemeMode } from './themes/ThemeManager'
import { useLanguage } from './localization/LanguageManager';
import { useDictionary } from './localization/Strings';

const VLangsAppBar: React.FC = () => {
    const { mode, setTheme } = useThemeMode();
    const { toggleLanguage } = useLanguage();
    const theme = useTheme();

    return (
        <AppBar
            position="sticky"
            color='primary'
            sx={{
                direction: useDictionary().direction,
                bgcolor: theme.palette.background.paper,
                borderBottom: 0.5,
                borderBottomColor: 'text.secondary',
                borderBottomStyle: 'groove',
            }}
        >
            <Toolbar>
                {/* RIGHT-aligned tools */}
                <Typography color="primary" variant="h1" sx={{ fontFamily: theme.typography.fontFamily?.at(1) }} component="div">
                    VLangs
                </Typography>

                {/* Spacer that pushes next items to the RIGHT */}
                <Box sx={{ flexGrow: 1 }} />

                {/* LEFT-aligned tools */}
                <Button
                    color="secondary"
                    sx={{
                        margin: 2,
                        border: '2px solid',
                        ":hover": {
                            transform: 'scale(1.05)',
                            bgcolor: theme.palette.background.paper,
                        },
                    }}
                    onClick={() => toggleLanguage()}
                >
                    <Typography>
                        {useLanguage().language === 'en' ? 'עברית' : 'English'}
                    </Typography>
                </Button>
                <IconButton
                    color="secondary"
                    sx={{
                        margin: 2,
                        bgcolor: theme.palette.background.paper + ' !important',
                        border: '2px solid',
                        ":hover": {
                            transform: 'scale(1.05)',
                        }
                    }}
                    onClick={() => setTheme(mode === 'dark' ? 'light' : 'dark')}
                >
                    {mode === 'dark' ? <LightModeTwoTone /> : <DarkModeTwoTone />}
                </IconButton>
            </Toolbar>
        </AppBar>

    );
};

export default VLangsAppBar;