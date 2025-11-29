import React, { useEffect, useState } from 'react';
import type { TabInfo } from '../data/models/TabInfo';
import { Button, IconButton, Stack, TextField, Typography, useTheme, Card, CardContent, Box } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { LANGUAGE_OPTIONS, type LanguageOption } from './activities/tab_creation/LanguageSelector';
import LanguageSelect from './activities/tab_creation/LanguageSelector';
import FileUpload from './activities/tab_creation/FileUpload';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import idbManager from '../data/storage/idbStorage';
import type { StorageInterface } from '../data/storage/StorageInterface';
import { useDictionary } from './localization/Strings';
import { ListAltTwoTone } from '@mui/icons-material';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

const storage: StorageInterface = idbManager;

interface TabsListProps {
    createPressed: () => void;
    navigateToTab: (id: string) => void;
    navigateToWordsOfTab: (tabId: string) => void;
}

export const TabsList: React.FC<TabsListProps> = ({ createPressed, navigateToTab, navigateToWordsOfTab }) => {
    const [tabs, setTabs] = useState<TabInfo[]>([]);
    const theme = useTheme();

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
                {useDictionary().tabs}
            </Typography>

            {tabs.length === 0 ? (
                <Stack spacing={2} alignItems="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        {useDictionary().no_tabs_yet}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {useDictionary().no_tabs_desc}
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
                {useDictionary().create_new_tab}
            </Button>
        </Stack>
    );
}

interface TabListItemProp {
    tab: TabInfo,
    onSelected: (id: string) => void
    onShowWordsPressed: (id: string) => void
    onDeletePressed: (id: string) => void
}

const TabListItem: React.FC<TabListItemProp> = (prop) => {
    const theme = useTheme();
    return (
        <Button
            dir={useDictionary().direction}
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

interface TabCreationProps {
    onCreate: () => void;
    onCancel: () => void;
}

export const TabCreation: React.FC<TabCreationProps> = ({ onCreate, onCancel }) => {
    const [newTabName, setNewTabName] = useState('');
    const [newTabPath, setNewTabPath] = useState('');
    const [targetLanguage, setTargetLanguage] = useState<LanguageOption>(LANGUAGE_OPTIONS[0]['code']);
    const [sourceLanguage, setSourceLanguage] = useState<LanguageOption>(LANGUAGE_OPTIONS[0]['code']);
    const [content, setContent] = useState<ArrayBuffer | null>(null);
    const [isInputValid, setInputValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState<number | undefined>(undefined);

    const dict = useDictionary();
    const theme = useTheme();

    useEffect(() => {
        setInputValid(validateInput());
    }, [newTabName, newTabPath, targetLanguage, sourceLanguage, content, loading, totalPages]);


    const validateInput = () => {
        try {
            JSON.stringify({ name: newTabName });
            if (newTabName.trim() === '') {
                return false;
            }
        } catch {
            return false;
        }

        if (sourceLanguage === targetLanguage) {
            return false;
        }

        if (content === null) {
            return false;
        }

        if (totalPages === undefined) {
            return false;
        }

        if (loading === true) {
            return false;
        }

        return true;
    }

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: '0 auto',
                padding: { xs: 2, sm: 3, md: 4 },
                width: '100%'
            }}
        >
            <Card
                elevation={4}
                sx={{
                    borderRadius: 3,
                    border: `2px solid ${theme.palette.divider}`
                }}
            >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Stack spacing={3}>
                        <Typography
                            variant={'h4'}
                            textAlign={'center'}
                            color='primary'
                            sx={{ fontWeight: 600, mb: 1 }}
                        >
                            {dict.create_new_tab}
                        </Typography>

                        <TextField
                            label={dict.tab_name}
                            fullWidth
                            value={newTabName}
                            onChange={e => setNewTabName(e.target.value)}
                            variant="outlined"
                            sx={{
                                '& input': {
                                    textAlign: 'center',
                                    fontSize: '1.1rem',
                                }
                            }}
                        />

                        <Box>
                            <FileUpload
                                onFileSelect={file => {
                                    if (!file) return;

                                    setLoading(true);
                                    setNewTabPath(file.name);

                                    const reader = new FileReader();
                                    reader.onload = async () => {
                                        const result = reader.result;
                                        if (result instanceof ArrayBuffer) {
                                            setContent(result.slice(0));
                                            getDocument(result!).promise.then((doc) => {
                                                setTotalPages(doc.numPages);
                                                setLoading(false);
                                            });
                                        }
                                    };
                                    reader.readAsArrayBuffer(file);
                                }}
                            />
                            {newTabPath && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1, textAlign: 'center' }}
                                >
                                    {newTabPath} {totalPages && `(${totalPages} ${dict.pages_count})`}
                                </Typography>
                            )}
                        </Box>

                        <LanguageSelect
                            label={dict.source_language}
                            value={sourceLanguage}
                            onChange={setSourceLanguage}
                        />

                        <LanguageSelect
                            label={dict.target_language}
                            value={targetLanguage}
                            onChange={setTargetLanguage}
                        />

                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Button
                                onClick={() => {
                                    const tab: TabInfo = {
                                        id: Date.now().toString(),
                                        title: newTabName.trim(),
                                        mode: "book",
                                        translationProvider: "google",
                                        createdAt: new Date(),
                                        lastOpenedAt: new Date(),
                                        modeProps: {
                                            sourcePath: newTabPath,
                                            currentPage: 1,
                                            totalPages: totalPages!
                                        },
                                        // Legacy compatibility properties
                                        name: newTabName.trim(),
                                        sourceLanguage: sourceLanguage,
                                        targetLanguage: targetLanguage,
                                        page: 1,
                                        totalPages: totalPages!,
                                        format: 'pdf'
                                    };

                                    storage.addTab(tab).then((ok) => {
                                        if (ok) {
                                            storage.saveFile(tab.id, content!).then((ok) => {
                                                if (ok) {
                                                    onCreate();
                                                }
                                            });
                                        }
                                    });
                                }}
                                variant="contained"
                                disabled={!isInputValid}
                                size="large"
                                sx={{
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textTransform: 'none'
                                }}
                            >
                                {dict.ok}
                            </Button>
                            <Button
                                onClick={onCancel}
                                variant="outlined"
                                size="large"
                                sx={{
                                    py: 1.5,
                                    fontSize: '1rem',
                                    textTransform: 'none'
                                }}
                            >
                                {dict.cancel}
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};