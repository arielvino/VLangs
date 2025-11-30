import React, { useEffect, useState } from 'react';
import type { TabInfo } from '../../../data/models/TabInfo';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import idbManager from '../../../data/storage/idbStorage';
import type { StorageInterface } from '../../../data/storage/StorageInterface';
import { useDictionary } from '../../localization/Strings';
import TabListItem from './TabListItem';

const storage: StorageInterface = idbManager;

interface TabsListProps {
    createPressed: () => void;
    navigateToTab: (id: string) => void;
    navigateToWordsOfTab: (tabId: string) => void;
}

export const TabsList: React.FC<TabsListProps> = ({ createPressed, navigateToTab, navigateToWordsOfTab }) => {
    const [tabs, setTabs] = useState<TabInfo[]>([]);
    const theme = useTheme();
    const dict = useDictionary();

    const refreshTabsList = () => {
        storage.getTabs().then(tabs => {
            setTabs(tabs);
        });
    }

    useEffect(() => {
        refreshTabsList()
    }, []);

    const removeTab = (id: string) => {
        storage.deleteTab(id)
        refreshTabsList()
    };

    return (
        <Stack
            spacing={3}
            alignItems={'center'}
            dir={dict.direction}
            sx={{
                padding: { xs: 2, sm: 3, md: 4 },
                maxWidth: 1200,
                margin: '0 auto',
                width: '100%'
            }}
        >
            <Typography
                color='primary'
                variant={'h3'}
                sx={{
                    fontWeight: 600,
                    mb: 2
                }}
            >
                {dict.tabs}
            </Typography>

            {tabs.length === 0 ? (
                <Stack spacing={2} alignItems="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        {dict.no_tabs_yet}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {dict.no_tabs_desc}
                    </Typography>
                </Stack>
            ) : (
                <Stack spacing={2} width="100%">
                    {tabs.map(tab => (
                        <TabListItem
                            key={tab.id}
                            tab={tab}
                            onSelected={navigateToTab}
                            onDeletePressed={removeTab}
                            onShowWordsPressed={navigateToWordsOfTab}
                        />
                    ))}
                </Stack>
            )}

            <Button
                color={'primary'}
                variant={'contained'}
                onClick={createPressed}
                size="large"
                sx={{
                    mt: 3,
                    px: 5,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    minWidth: 250,
                    boxShadow: 3,
                    '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                }}
            >
                {dict.create_new_tab}
            </Button>
        </Stack>
    );
}

export default TabsList;
