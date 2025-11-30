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
    const dict = useDictionary();

    return (
        <AppBar
            position="sticky"
            color='primary'
            elevation={0}
            sx={{
                direction: dict.direction,
                background: theme.palette.mode === 'dark'
                    ? `
                        radial-gradient(ellipse 500px 300px at 0% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 70%),
                        radial-gradient(ellipse 500px 300px at 100% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 70%),
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 10px,
                            rgba(99, 102, 241, 0.03) 10px,
                            rgba(99, 102, 241, 0.03) 20px
                        ),
                        linear-gradient(90deg, ${theme.palette.background.paper} 0%, rgba(26, 41, 66, 0.95) 50%, ${theme.palette.background.paper} 100%)
                    `
                    : `
                        radial-gradient(ellipse 500px 300px at 0% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 70%),
                        radial-gradient(ellipse 500px 300px at 100% 50%, rgba(244, 114, 182, 0.12) 0%, transparent 70%),
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 10px,
                            rgba(99, 102, 241, 0.02) 10px,
                            rgba(99, 102, 241, 0.02) 20px
                        ),
                        linear-gradient(90deg, ${theme.palette.background.paper} 0%, rgba(224, 231, 255, 0.95) 50%, ${theme.palette.background.paper} 100%)
                    `,
                borderBottom: `3px solid ${theme.palette.primary.main}`,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`
            }}
        >
            <Toolbar sx={{
                py: { xs: 1.5, sm: 2 },
                minHeight: { xs: 64, sm: 72 },
                px: { xs: 2, sm: 4, md: 6 },
                display: 'flex',
                justifyContent: 'space-between',
                gap: 3
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
                <Stack direction="row" spacing={{ xs: 3, sm: 4 }} alignItems="center">
                    <Button
                        color="secondary"
                        size="medium"
                        variant="outlined"
                        sx={{
                            borderWidth: 2,
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 700,
                            px: { xs: 2.5, sm: 3 },
                            py: { xs: 0.75, sm: 1 },
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            minWidth: { xs: 80, sm: 95 },
                            boxShadow: 2,
                            bgcolor: theme.palette.background.default,
                            ":hover": {
                                borderWidth: 2,
                                transform: 'translateY(-2px)',
                                boxShadow: 4,
                                bgcolor: theme.palette.secondary.main,
                                color: theme.palette.background.paper
                            },
                            transition: 'all 0.2s ease'
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
                            border: `2px solid ${theme.palette.secondary.main}`,
                            borderRadius: 3,
                            p: { xs: 1, sm: 1.5 },
                            boxShadow: 2,
                            ":hover": {
                                bgcolor: theme.palette.secondary.main,
                                color: theme.palette.background.paper,
                                transform: 'translateY(-2px)',
                                boxShadow: 4
                            },
                            transition: 'all 0.2s ease'
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