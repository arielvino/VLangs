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
            <Toolbar sx={{ py: { xs: 0.75, sm: 1.25 }, minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3 } }}>
                {/* App title */}
                <Typography
                    color="primary"
                    sx={{
                        fontFamily: theme.typography.fontFamily?.at(1),
                        fontWeight: 700,
                        letterSpacing: '-0.5px',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                        textShadow: `1px 1px 2px ${theme.palette.primary.dark}40`
                    }}
                    component="div"
                >
                    VLangs
                </Typography>

                {/* Spacer */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Controls */}
                <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
                    <Button
                        color="secondary"
                        size="small"
                        variant="outlined"
                        sx={{
                            borderWidth: 2,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: { xs: 1.5, sm: 2 },
                            py: { xs: 0.5, sm: 0.75 },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            minWidth: { xs: 'auto', sm: 'auto' },
                            ":hover": {
                                borderWidth: 2,
                                transform: 'scale(1.05)',
                                boxShadow: 2
                            },
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => toggleLanguage()}
                    >
                        {useLanguage().language === 'en' ? 'עברית' : 'English'}
                    </Button>
                    <IconButton
                        size='small'
                        color="secondary"
                        sx={{
                            bgcolor: theme.palette.background.default,
                            border: `2px solid ${theme.palette.secondary.main}`,
                            borderRadius: 2,
                            p: { xs: 0.5, sm: 1 },
                            ":hover": {
                                bgcolor: theme.palette.secondary.main,
                                color: theme.palette.background.paper,
                                transform: 'scale(1.05)',
                                boxShadow: 2
                            },
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => setTheme(mode === 'dark' ? 'light' : 'dark')}
                    >
                        {mode === 'dark' ? <LightModeTwoTone fontSize="small" /> : <DarkModeTwoTone fontSize="small" />}
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default VLangsAppBar;