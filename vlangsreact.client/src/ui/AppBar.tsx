import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DarkModeTwoTone from '@mui/icons-material/DarkModeTwoTone';
import { Box, Button, Stack, useTheme } from '@mui/material';
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
            elevation={0}
            sx={{
                direction: useDictionary().direction,
                bgcolor: theme.palette.background.paper,
                borderBottom: `3px solid ${theme.palette.primary.main}`,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
        >
            <Toolbar sx={{
                py: { xs: 1.5, sm: 2 },
                minHeight: { xs: 64, sm: 72 },
                px: { xs: 2, sm: 4 },
                gap: 2
            }}>
                {/* App title */}
                <Typography
                    color="primary"
                    sx={{
                        fontFamily: theme.typography.fontFamily?.at(1),
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                        textShadow: `2px 2px 4px ${theme.palette.primary.dark}50`,
                        flexShrink: 0
                    }}
                    component="div"
                >
                    VLangs
                </Typography>

                {/* Spacer */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Controls */}
                <Stack direction="row" spacing={{ xs: 1.5, sm: 2.5 }} alignItems="center">
                    <Button
                        color="secondary"
                        size="medium"
                        variant="outlined"
                        sx={{
                            borderWidth: 2.5,
                            borderRadius: 2.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            px: { xs: 2, sm: 2.5 },
                            py: { xs: 0.75, sm: 1 },
                            fontSize: { xs: '0.85rem', sm: '0.95rem' },
                            minWidth: { xs: 'auto', sm: 'auto' },
                            boxShadow: 1,
                            ":hover": {
                                borderWidth: 2.5,
                                transform: 'scale(1.08)',
                                boxShadow: 3,
                                bgcolor: theme.palette.secondary.main + '15'
                            },
                            transition: 'all 0.15s ease-out'
                        }}
                        onClick={() => toggleLanguage()}
                    >
                        {useLanguage().language === 'en' ? 'עברית' : 'English'}
                    </Button>
                    <IconButton
                        size='medium'
                        color="secondary"
                        sx={{
                            bgcolor: theme.palette.background.default,
                            border: `2.5px solid ${theme.palette.secondary.main}`,
                            borderRadius: 2.5,
                            p: { xs: 0.75, sm: 1.25 },
                            boxShadow: 1,
                            ":hover": {
                                bgcolor: theme.palette.secondary.main,
                                color: theme.palette.background.paper,
                                transform: 'scale(1.08)',
                                boxShadow: 3
                            },
                            transition: 'all 0.15s ease-out'
                        }}
                        onClick={() => setTheme(mode === 'dark' ? 'light' : 'dark')}
                    >
                        {mode === 'dark' ? <LightModeTwoTone /> : <DarkModeTwoTone />}
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default VLangsAppBar;