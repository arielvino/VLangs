import React, { useEffect, useState } from 'react';
import idbStorage from '../data/storage/idbStorage';
import type { StorageInterface } from '../data/storage/StorageInterface';
import { type WordEntry } from '../data/models/WordEntry'
import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { useDictionary } from './localization/Strings';
import { ArrowBackRounded, ArrowForwardRounded } from '@mui/icons-material';
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
        <Box>
            <Stack spacing={1} direction={dict.direction === 'ltr' ? 'row' : 'row-reverse'} width='100%' position='static'>
                <Typography variant="h6" textAlign={'center'}>{tab?.name}</Typography>
                <Box flexGrow={1} />
                <IconButton onClick={onBackPressed} sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.background.paper,
                    ":hover": {
                        bgcolor: theme.palette.primary.main + ' !important',
                    }
                }}>{dict.direction === 'ltr' ? <ArrowBackRounded /> : <ArrowForwardRounded />}</IconButton>
            </Stack>
            <>
                <Typography variant="h5" gutterBottom color="primary">
                    {useDictionary().words_list}
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: theme.palette.secondary.main }}>
                                <Typography color="secondary">Word</Typography>
                            </TableCell>
                            <TableCell sx={{ color: theme.palette.secondary.main }}>
                                <Typography color="secondary">Translation</Typography>
                            </TableCell>
                            <TableCell sx={{ color: theme.palette.secondary.main }}>
                                <Typography color="secondary">Times Asked</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...words].map((word, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Typography>{word.word}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{word.translation}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{word.timesAsked}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </>
        </Box>
    );
};

export default WordsList;