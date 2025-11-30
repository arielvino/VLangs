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
import { ListAltTwoTone, UploadFile, Article, Language, Check } from '@mui/icons-material';

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
                maxWidth: 700,
                margin: '0 auto',
                padding: { xs: 2, sm: 3, md: 4 },
                width: '100%'
            }}
        >
            <Card
                elevation={0}
                sx={{
                    borderRadius: 4,
                    border: `2px solid ${theme.palette.divider}`,
                    background: theme.palette.mode === 'dark'
                        ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, rgba(42, 58, 82, 0.4) 100%)`
                        : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, rgba(224, 231, 255, 0.3) 100%)`,
                    overflow: 'visible'
                }}
            >
                <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                    <Stack spacing={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Article sx={{ fontSize: 56, color: theme.palette.primary.main, mb: 2 }} />
                            <Typography
                                variant={'h4'}
                                color='primary'
                                sx={{ fontWeight: 700, mb: 1 }}
                            >
                                {dict.create_new_tab}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Upload a PDF and set your learning preferences
                            </Typography>
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <Box
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 28,
                                        height: 28,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        mr: 1.5
                                    }}
                                >
                                    1
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Tab Name
                                </Typography>
                            </Box>
                            <TextField
                                label={dict.tab_name}
                                fullWidth
                                value={newTabName}
                                onChange={e => setNewTabName(e.target.value)}
                                variant="outlined"
                                placeholder="My Reading Material"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: theme.palette.background.default,
                                        '&:hover': {
                                            bgcolor: theme.palette.action.hover
                                        }
                                    }
                                }}
                            />
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <Box
                                    sx={{
                                        bgcolor: content ? theme.palette.success.main : theme.palette.primary.main,
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 28,
                                        height: 28,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        mr: 1.5,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {content ? <Check sx={{ fontSize: 18 }} /> : '2'}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Upload PDF
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    border: `2px dashed ${content ? theme.palette.success.main : theme.palette.divider}`,
                                    borderRadius: 2,
                                    p: 3,
                                    textAlign: 'center',
                                    bgcolor: theme.palette.background.default,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        bgcolor: theme.palette.action.hover
                                    }
                                }}
                            >
                                <UploadFile sx={{ fontSize: 48, color: content ? theme.palette.success.main : theme.palette.text.secondary, mb: 1 }} />
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
                                    <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)', borderRadius: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                                            ✓ {newTabPath}
                                        </Typography>
                                        {totalPages && (
                                            <Typography variant="body2" color="text.secondary">
                                                {totalPages} {dict.pages_count}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <Box
                                    sx={{
                                        bgcolor: (sourceLanguage !== targetLanguage && sourceLanguage) ? theme.palette.success.main : theme.palette.primary.main,
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 28,
                                        height: 28,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        mr: 1.5,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {(sourceLanguage !== targetLanguage && sourceLanguage) ? <Check sx={{ fontSize: 18 }} /> : '3'}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Languages
                                </Typography>
                            </Box>
                            <Stack spacing={2}>
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
                            </Stack>
                        </Box>

                        <Stack spacing={2} sx={{ mt: 3 }}>
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
                                startIcon={<Check />}
                                sx={{
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: 3,
                                    '&:hover': {
                                        boxShadow: 6,
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.2s ease'
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
                                    textTransform: 'none',
                                    '&:hover': {
                                        bgcolor: theme.palette.action.hover
                                    }
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