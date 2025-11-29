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
                borderBottom: `2px solid ${theme.palette.divider}`,
                backdropFilter: 'blur(8px)',
            }}
        >
            <Toolbar sx={{ py: 1 }}>
                {/* App title */}
                <Typography
                    color="primary"
                    variant="h4"
                    sx={{
                        fontFamily: theme.typography.fontFamily?.at(1),
                        fontWeight: 700,
                        letterSpacing: '-0.5px'
                    }}
                    component="div"
                >
                    VLangs
                </Typography>

                {/* Spacer */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Controls */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Button
                        color="secondary"
                        size="medium"
                        variant="outlined"
                        sx={{
                            borderWidth: 2,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 2,
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
                        size='medium'
                        color="secondary"
                        sx={{
                            bgcolor: theme.palette.background.default,
                            border: `2px solid ${theme.palette.secondary.main}`,
                            borderRadius: 2,
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
                        {mode === 'dark' ? <LightModeTwoTone /> : <DarkModeTwoTone />}
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default VLangsAppBar;