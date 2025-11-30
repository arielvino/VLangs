import React from 'react';
import type { TabInfo } from '../../../data/models/TabInfo';
import { Button, IconButton, Typography, useTheme } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { ListAltTwoTone } from '@mui/icons-material';
import { useDictionary } from '../../localization/Strings';

interface TabListItemProps {
    tab: TabInfo;
    onSelected: (id: string) => void;
    onShowWordsPressed: (id: string) => void;
    onDeletePressed: (id: string) => void;
}

const TabListItem: React.FC<TabListItemProps> = (prop) => {
    const theme = useTheme();
    const dict = useDictionary();

    return (
        <Button
            dir={dict.direction}
            onClick={(e) => {
                prop.onSelected(prop.tab.id);
                e.stopPropagation();
            }}
            fullWidth
            variant="outlined"
            component="div"
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr auto auto', md: '3fr 1fr 1fr auto auto' },
                gap: { xs: 1, md: 2 },
                textAlign: 'start',
                alignItems: 'center',
                justifyContent: 'start',
                border: '2px solid',
                borderColor: theme.palette.divider,
                borderRadius: 2,
                p: 2,
                bgcolor: theme.palette.background.paper,
                transition: 'all 0.3s ease',
                ':hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: theme.palette.action.hover,
                    transform: 'translateX(4px)',
                    boxShadow: 4
                },
            }}
        >
            <Typography
                variant='h6'
                sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >
                {prop.tab.name}
            </Typography>
            <Typography
                color={'text.secondary'}
                sx={{ display: { xs: 'none', md: 'block' }, fontSize: '0.95rem' }}
            >
                {prop.tab.sourceLanguage}
            </Typography>
            <Typography
                color={'text.secondary'}
                sx={{ display: { xs: 'none', md: 'block' }, fontSize: '0.95rem' }}
            >
                {prop.tab.targetLanguage}
            </Typography>
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    prop.onShowWordsPressed(prop.tab.id);
                }}
                aria-label="view words"
                size="medium"
                color={'primary'}
                sx={{
                    bgcolor: theme.palette.background.default,
                    border: '2px solid',
                    borderColor: theme.palette.primary.main,
                    ":hover": {
                        transform: 'scale(1.1)',
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.background.paper,
                        borderColor: theme.palette.primary.main
                    },
                    transition: 'all 0.2s ease'
                }}
            >
                <ListAltTwoTone fontSize="small" />
            </IconButton>
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    prop.onDeletePressed(prop.tab.id);
                }}
                aria-label="delete"
                size="medium"
                color={'error'}
                sx={{
                    bgcolor: theme.palette.background.default,
                    border: '2px solid',
                    borderColor: theme.palette.error.main,
                    ":hover": {
                        transform: 'scale(1.1)',
                        bgcolor: theme.palette.error.main,
                        color: theme.palette.background.paper,
                        borderColor: theme.palette.error.main
                    },
                    transition: 'all 0.2s ease'
                }}
            >
                <DeleteOutlined fontSize="small" />
            </IconButton>
        </Button>
    );
}

export default TabListItem;
