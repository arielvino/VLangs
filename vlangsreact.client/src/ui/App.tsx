import { useEffect, useState } from 'react';
import { TabCreation, TabsList } from './TabsManager';
import { Box, Paper } from '@mui/material';
import VLangsAppBar from './AppBar';
import { useTheme } from '@mui/material';
import LandingScreen from './LandingScreen';
import WordsList from './WordsList';
import { ReadTab } from './activities/reading/ReadTab';

function App() {
    type Activity =
        { name: 'landing_screen', param: '' } |
        { name: 'tabs_list', param: '' } |
        { name: 'read_tab', param: string } |
        { name: 'create_tab', param: '' } |
        { name: 'tab_words', param: string };

    const ACTIVITY_STORAGE_KEY = 'activity';

    const useActivity = () => {
        const [activity, setActivity] = useState<Activity>(() => {
            const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
            return saved ? JSON.parse(saved) as Activity : { name: 'landing_screen', param: '' };
        });

        useEffect(() => {
            localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
        }, [activity]);

        return [activity, setActivity] as const;
    };

    const [activity, setActivity] = useActivity();

    const theme = useTheme();

    return (
        <Box
            sx={{
                background: theme.palette.mode === 'dark'
                    ? `
                        radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                        radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                        radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                        linear-gradient(135deg, ${theme.palette.background.default} 0%, #1a2942 40%, #162033 60%, ${theme.palette.background.default} 100%)
                    `
                    : `
                        radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
                        radial-gradient(ellipse at bottom right, rgba(244, 114, 182, 0.08) 0%, transparent 50%),
                        radial-gradient(ellipse at top right, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
                        linear-gradient(135deg, ${theme.palette.background.default} 0%, #e0e7ff 35%, #f0f4ff 65%, ${theme.palette.background.default} 100%)
                    `,
                overflowX: 'hidden',
                width: '100%',
                maxWidth: '100vw',
                minHeight: '100vh'
            }}
        >
            <VLangsAppBar />
            <Box
                sx={{
                    display: 'grid',
                    placeItems: 'center',
                    minHeight: '100vh',
                    padding: { xs: 1, sm: 2 },
                    width: '100%',
                    boxSizing: 'border-box',
                    overflowX: 'hidden'
                }}
            >
                <Paper
                    color="text.primary"
                    sx={{
                        border: '1px solid',
                        borderColor: useTheme().palette.text.primary,
                        padding: { xs: 1, sm: 2 },
                        width: 'auto',
                        minWidth: { xs: '95%', sm: '600px' },
                        maxWidth: { xs: '100%', sm: '95%', md: '1200px' },
                        boxSizing: 'border-box',
                        overflowX: 'hidden'
                    }}>

                    {activity.name === 'landing_screen' && (
                        <LandingScreen
                            onNavigateToTabsMenu={() => {
                                setActivity({ name: 'tabs_list', param: '' })
                            }}
                        />
                    )}

                    {activity.name === 'tabs_list' && (
                        <TabsList
                            createPressed={() => setActivity({ name: 'create_tab', param: '' })}
                            navigateToTab={(id) =>
                                setActivity({ name: 'read_tab', param: id })
                            }
                            navigateToWordsOfTab={(tabId) => {
                                setActivity({ name: 'tab_words', param: tabId })
                            }}
                        />
                    )}

                    {activity.name === 'read_tab' && (
                        <ReadTab
                            tabId={activity.param}
                            onBackPressed={() => setActivity({ name: 'tabs_list', param: '' })}
                        />
                    )}

                    {activity.name === 'tab_words' && (
                        <WordsList
                            tabId={activity.param}
                            onBackPressed={() => setActivity({ name: 'tabs_list', param: '' })}
                        />
                    )}

                    {activity.name === 'create_tab' && (
                        <TabCreation
                            onCancel={() => setActivity({ name: 'tabs_list', param: '' })}
                            onCreate={() => setActivity({ name: 'tabs_list', param: '' })}
                        />
                    )}
                </Paper >
            </Box>
        </Box>
    )
}

export default App;