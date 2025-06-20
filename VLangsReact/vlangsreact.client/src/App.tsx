import { useState } from 'react';
import TabsMenu from './TabsMenu';
import { Box, useTheme } from '@mui/material';
import VLangsAppBar from './AppBar';

function App() {
    type Activity = 'tabs'

    const [activity, setActivity] = useState<Activity>('tabs');

    return (
        <>
            <VLangsAppBar />
            <Box
                bgcolor="background.default"
                color="text.primary"
                sx={{
                    display: 'grid',
                    placeItems: 'center',
                    height: '100vh',
                }
                }>

                {
                    {
                        tabs: <TabsMenu />
                    }
                    [activity]
                }
            </Box >
        </>
    )
}

export default App;