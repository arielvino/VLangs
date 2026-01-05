import { Button, Stack, Typography, Box, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material';
import MenuBook from '@mui/icons-material/MenuBook';
import Translate from '@mui/icons-material/Translate';
import TrendingUp from '@mui/icons-material/TrendingUp';
import { useDictionary } from './localization/Strings';

interface LandingScreenProps {
    onNavigateToTabsMenu: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigateToTabsMenu }) => {
    const theme = useTheme();
    const dict = useDictionary();

    const features = [
        {
            icon: <MenuBook sx={{ fontSize: 56, color: theme.palette.primary.main }} />,
            title: dict.feature_read_title,
            description: dict.feature_read_desc
        },
        {
            icon: <Translate sx={{ fontSize: 56, color: theme.palette.primary.main }} />,
            title: dict.feature_translate_title,
            description: dict.feature_translate_desc
        },
        {
            icon: <TrendingUp sx={{ fontSize: 56, color: theme.palette.primary.main }} />,
            title: dict.feature_progress_title,
            description: dict.feature_progress_desc
        }
    ];

    return (
        <Stack
            spacing={6}
            alignItems="center"
            dir={dict.direction}
            sx={{
                maxWidth: 900,
                margin: '0 auto',
                padding: { xs: 2, sm: 4, md: 6 },
                textAlign: 'center',
                minHeight: 'calc(100vh - 100px)',
                justifyContent: 'center',
                width: '100%',
                boxSizing: 'border-box',
                overflowX: 'hidden'
            }}
        >
            {/* Hero Section */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: theme.palette.primary.main,
                        mb: 2,
                        fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }
                    }}
                >
                    {dict.app_title}
                </Typography>
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        color: theme.palette.text.primary,
                        mb: 2,
                        fontWeight: 500,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                    }}
                >
                    {dict.tagline}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: theme.palette.text.secondary,
                        maxWidth: 600,
                        margin: '0 auto',
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                        fontWeight: 400
                    }}
                >
                    {dict.hero_description}
                </Typography>
            </Box>

            {/* CTA Button */}
            <Button
                variant="contained"
                size="large"
                onClick={onNavigateToTabsMenu}
                sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.25rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: 4,
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 8
                    },
                    transition: 'all 0.15s ease-out'
                }}
            >
                {dict.get_started}
            </Button>

            {/* Features Stack */}
            <Stack spacing={3} sx={{ width: '100%', maxWidth: 600, mt: 4 }}>
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        elevation={0}
                        sx={{
                            width: '100%',
                            transition: 'all 0.3s ease',
                            border: `2px solid ${theme.palette.divider}`,
                            background: theme.palette.mode === 'dark'
                                ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, #2a3a52 100%)`
                                : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, #f0f4ff 100%)`,
                            boxSizing: 'border-box',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                borderColor: theme.palette.primary.main,
                                boxShadow: 6,
                                background: theme.palette.mode === 'dark'
                                    ? `linear-gradient(145deg, #2a3a52 0%, ${theme.palette.background.paper} 100%)`
                                    : `linear-gradient(145deg, #f0f4ff 0%, ${theme.palette.background.paper} 100%)`
                            }
                        }}
                    >
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                p: 3
                            }}
                        >
                            <Box sx={{ mb: 2 }}>
                                {feature.icon}
                            </Box>
                            <Typography
                                variant="h5"
                                component="h3"
                                gutterBottom
                                sx={{ fontWeight: 600, mb: 1.5 }}
                            >
                                {feature.title}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ lineHeight: 1.6 }}
                            >
                                {feature.description}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Stack>
    );
};

export default LandingScreen;
