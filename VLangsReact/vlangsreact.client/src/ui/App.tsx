import { useEffect, useState } from 'react';
import { ReadTab, TabCreation, TabsList } from './TabsManager';
import { Box } from '@mui/material';
import VLangsAppBar from './AppBar';
import { useTheme } from '@mui/material';

function App() {
    type Activity = { name: 'tabs_list', param: '' } | { name: 'read_tab', param: string } | { name: 'create_tab', param: '' };

    const ACTIVITY_STORAGE_KEY = 'activity';

    const useActivity = () => {
        const [activity, setActivity] = useState<Activity>(() => {
            const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
            return saved ? JSON.parse(saved) as Activity : { name: 'tabs_list', param: '' };
        });

        useEffect(() => {
            localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
        }, [activity]);

        return [activity, setActivity] as const;
    };

    const [activity, setActivity] = useActivity();

    const theme = useTheme();

    return (
        <Box bgcolor={theme.palette.background.default}>
            <VLangsAppBar />
            <Box
                color="text.primary"
                sx={{
                    display: 'grid',
                    placeItems: 'center',
                    height: '100vh'
                }}>

                {activity.name === 'tabs_list' && (
                    <TabsList
                        createPressed={() => setActivity({ name: 'create_tab', param: '' })}
                        navigateToTab={(id) => { setActivity({ name: 'read_tab', param: id }); console.log('navigate to tab') }}
                    />
                )}

                {activity.name === 'read_tab' && (
                    <ReadTab
                        id={activity.param}
                        onBackPressed={() => setActivity({ name: 'tabs_list', param: '' })}
                    />
                )}

                {activity.name === 'create_tab' && (
                    <TabCreation
                        onCancel={() => setActivity({ name: 'tabs_list', param: '' })}
                        onCreate={() => setActivity({ name: 'tabs_list', param: '' })}
                    />
                )}
            </Box >
        </Box>
    )
}

export default App;