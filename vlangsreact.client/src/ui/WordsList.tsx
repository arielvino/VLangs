import React, { useEffect, useState } from 'react';
import idbStorage from '../data/storage/idbStorage';
import type { StorageInterface } from '../data/storage/StorageInterface';
import { type WordEntry } from '../data/models/WordEntry'
import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { useDictionary } from './localization/Strings';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import type { TabInfo } from '../data/models/TabInfo';

const storage: StorageInterface = idbStorage;

interface WordsListProps {
    tabId: string;
    onBackPressed: () => void
}

const WordsList: React.FC<WordsListProps> = ({ tabId, onBackPressed }) => {
    const dict = useDictionary();
    const theme = useTheme();

    const [tab, setTab] = useState<TabInfo | undefined>();
    const [words, setWords] = useState<Set<WordEntry>>(new Set())

    useEffect(() => {
        storage.getWordEntriesByTab(tabId).then((ws) => setWords(new Set(ws)))
        storage.getTab(tabId).then(tab => {
            setTab(tab);
        });
    }, [tabId]);

    return (
        <Box
            sx={{
                maxWidth: 1000,
                margin: '0 auto',
                padding: { xs: 2, sm: 3, md: 4 },
                width: '100%'
            }}
        >
            {/* Header with title and back button */}
            <Stack
                spacing={2}
                direction={dict.direction === 'ltr' ? 'row' : 'row-reverse'}
                sx={{
                    padding: 2,
                    width: '100%',
                    alignItems: 'center',
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                    border: `2px solid ${theme.palette.divider}`,
                    boxShadow: 2,
                    mb: 3
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {tab?.name}
                </Typography>
                <Box flexGrow={1} />
                <IconButton
                    onClick={onBackPressed}
                    size="large"
                    sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.background.paper,
                        border: `2px solid ${theme.palette.primary.main}`,
                        ":hover": {
                            bgcolor: theme.palette.primary.dark,
                            transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    {dict.direction === 'ltr' ? <ArrowBackRounded /> : <ArrowForwardRounded />}
                </IconButton>
            </Stack>

            {/* Words list section */}
            <Box
                sx={{
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                    border: `2px solid ${theme.palette.divider}`,
                    boxShadow: 2,
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ p: 3, borderBottom: `2px solid ${theme.palette.divider}` }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                        {dict.words_list}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {words.size} {words.size === 1 ? dict.word : dict.words} {dict.learned}
                    </Typography>
                </Box>

                {words.size === 0 ? (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            {dict.no_words_yet}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {dict.no_words_desc}
                        </Typography>
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                                <TableCell>
                                    <Typography
                                        color="secondary"
                                        sx={{ fontWeight: 600, fontSize: '1rem' }}
                                    >
                                        {dict.table_word}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        color="secondary"
                                        sx={{ fontWeight: 600, fontSize: '1rem' }}
                                    >
                                        {dict.table_translation}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography
                                        color="secondary"
                                        sx={{ fontWeight: 600, fontSize: '1rem' }}
                                    >
                                        {dict.table_times_asked}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...words].map((word, i) => (
                                <TableRow
                                    key={i}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: theme.palette.action.hover
                                        },
                                        transition: 'background-color 0.2s ease'
                                    }}
                                >
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 500 }}>
                                            {word.word}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography color="text.secondary">
                                            {word.translation.type === "text" ? word.translation.content : ""}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.primary.main
                                            }}
                                        >
                                            {word.timesAsked || 0}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
        </Box>
    );
};

export default WordsList;