import { Button, Stack, Typography, Box, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material';
import { MenuBook, Translate, School, TrendingUp } from '@mui/icons-material';

interface LandingScreenProps {
    onNavigateToTabsMenu: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigateToTabsMenu }) => {
    const theme = useTheme();

    const features = [
        {
            icon: <MenuBook sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
            title: 'Read in Any Language',
            description: 'Import PDFs and texts to read in your target language with instant translation support.'
        },
        {
            icon: <Translate sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
            title: 'Click to Translate',
            description: 'Click any word to see its translation powered by Google Translate API.'
        },
        {
            icon: <School sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
            title: 'Track Your Progress',
            description: 'Mark words as known and track your vocabulary growth across all your reading materials.'
        },
        {
            icon: <TrendingUp sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
            title: 'Smart Learning',
            description: 'OCR support for scanned documents and automatic word tracking help you learn naturally.'
        }
    ];

    return (
        <Stack
            spacing={4}
            alignItems="center"
            sx={{
                maxWidth: 800,
                margin: '0 auto',
                padding: 3,
                textAlign: 'center'
            }}
        >
            {/* Hero Section */}
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: theme.palette.primary.main,
                        mb: 2
                    }}
                >
                    VLangs
                </Typography>
                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        color: theme.palette.text.secondary,
                        mb: 3
                    }}
                >
                    Learn Languages Through Reading
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.text.secondary,
                        mb: 4,
                        maxWidth: 600,
                        margin: '0 auto'
                    }}
                >
                    Upload your favorite books, articles, or documents and learn a new language naturally by reading.
                    Click any word for instant translation and track your vocabulary progress.
                </Typography>
            </Box>

            {/* CTA Buttons */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 4 }}
            >
                <Button
                    variant="contained"
                    size="large"
                    onClick={onNavigateToTabsMenu}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    Get Started
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={onNavigateToTabsMenu}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        textTransform: 'none'
                    }}
                >
                    View My Library
                </Button>
            </Stack>

            {/* Features Grid */}
            <Box sx={{ width: '100%' }}>
                <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                        mb: 3,
                        fontWeight: 'bold'
                    }}
                >
                    Features
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 3
                    }}
                >
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            elevation={2}
                            sx={{
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
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
                                    variant="h6"
                                    component="h4"
                                    gutterBottom
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>

            {/* Footer CTA */}
            <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}`, width: '100%' }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                >
                    Ready to Start Learning?
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Create your first reading tab and begin your language learning journey today.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={onNavigateToTabsMenu}
                    sx={{
                        px: 5,
                        py: 1.5,
                        fontSize: '1rem',
                        textTransform: 'none'
                    }}
                >
                    Browse Library
                </Button>
            </Box>
        </Stack>
    );
};

export default LandingScreen;
