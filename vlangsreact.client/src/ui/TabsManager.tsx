import React, { useEffect, useState } from 'react';
import type { TabInfo } from '../data/models/TabInfo';
import PdfPageReader from './activities/reading/PdfPageReader';
import { Box, Button, IconButton, Slider, Stack, TextField, Typography, useTheme } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { getDirection, LANGUAGE_OPTIONS, type LanguageOption } from './activities/tab_creation/LanguageSelector';
import LanguageSelect from './activities/tab_creation/LanguageSelector';
import FileUpload from './activities/tab_creation/FileUpload';
import { ArrowBackRounded, ArrowBackTwoTone, ArrowForwardRounded, ArrowForwardTwoTone, ListAltTwoTone } from '@mui/icons-material';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import idbManager from '../data/storage/idbStorage';
import type { StorageInterface } from '../data/storage/StorageInterface';
import { useDictionary } from './localization/Strings';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

const storage: StorageInterface = idbManager;

interface TabsListProps {
    createPressed: () => void;
    navigateToTab: (id: string) => void;
    navigateToWordsOfTab: (tabId: string) => void;
}

export const TabsList: React.FC<TabsListProps> = ({ createPressed, navigateToTab, navigateToWordsOfTab }) => {
    const [tabs, setTabs] = useState<TabInfo[]>([]);

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
        <Stack spacing={2} alignItems={'center'} padding={2} borderRadius={2}>
            <Typography color='textPrimary' variant={'h4'}>{useDictionary().tabs}</Typography>
            {tabs.map(tab => (
                <TabListItem
                    key={tab.id} tab={tab}
                    onSelected={navigateToTab}
                    onDeletePressed={removeTab}
                    onShowWordsPressed={navigateToWordsOfTab}></TabListItem>
            ))}

            <Button color={'secondary'} variant={'outlined'} onClick={createPressed} fullWidth>{useDictionary().create_new_tab}</Button>
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
                gridTemplateColumns: '6fr 1fr 1fr 1fr 1fr',
                textAlign: 'start',
                alignItems: 'center',
                justifyContent: 'start',
                border: '2px solid',
                ':hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.text.primary,
                },
            }}
        >
            <Typography variant='h6'>{prop.tab.name}</Typography>
            <Typography color={'textPrimary'}>{prop.tab.sourceLanguage}</Typography>
            <Typography color={'textPrimary'}>{prop.tab.targetLanguage}</Typography>
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    prop.onShowWordsPressed(prop.tab.id);
                }}
                aria-label="delete"
                size="small"
                color={'primary'}
                sx={{
                    bgcolor: theme.palette.background.paper,
                    border: '1px solid',
                    borderColor: theme.palette.primary.main,
                    ":hover": { transform: 'scale(1.15)', bgcolor: theme.palette.background.paper + ' !important' }
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
                size="small"
                color={'error'}
                sx={{
                    bgcolor: theme.palette.background.paper,
                    border: '1px solid',
                    borderColor: theme.palette.error.main,
                    ":hover": { transform: 'scale(1.15)', bgcolor: theme.palette.background.paper + ' !important' }
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
        <Stack spacing={2}>
            <Typography variant={'h5'} textAlign={'center'} color='primary'>{dict.create_new_tab}</Typography>
            <TextField
                label={dict.tab_name}
                fullWidth
                value={newTabName}
                onChange={e => setNewTabName(e.target.value)}
                sx={{
                    '& input': {
                        textAlign: 'center',
                    }
                }}
            />
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
            {newTabPath ? <Typography>{newTabPath}</Typography> : <></>}
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
            <Button
                onClick={() => {
                    const tab: TabInfo = {
                        id: Date.now().toString(),
                        name: newTabName.trim(),
                        sourceType: 'local',
                        format: 'pdf',
                        sourceLanguage: sourceLanguage,
                        targetLanguage: targetLanguage,
                        page: 1,
                        totalPages: totalPages!,
                        sourceHint: newTabPath
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
            >
                {dict.ok}
            </Button>
            <Button onClick={onCancel}>{dict.cancel}</Button>
        </Stack >
    );
};

interface ReadTabProps {
    id: string;
    onBackPressed: () => void;
}

export const ReadTab: React.FC<ReadTabProps> = ({ id, onBackPressed }) => {
    const [tab, setTab] = useState<TabInfo | undefined>();
    const [page, setPage] = useState<number>(0);
    const [content, setContent] = useState<ArrayBuffer | undefined>(undefined);

    const dict = useDictionary();
    const theme = useTheme();

    useEffect(() => {
        storage.getTab(id).then(tab => {
            setTab(tab);
            if (tab?.sourceType === 'local') {
                storage.loadFile(tab.id)
                    .then(data => {
                        if (data) {
                            if (data instanceof ArrayBuffer) {
                                setContent(data);
                                setPage(tab.page)
                            }
                        } else {
                            console.error('File not found in IndexedDB');
                        }
                    })
                    .catch(err => {
                        console.error('Error loading file:', err);
                    });
            }
        });
    }, [id]);

    useEffect(() => {
        if (page) {
            storage.updateTab(id, { page: page })
        }
    }, [page])

    return (
        <Stack spacing={2} margin={2} alignItems={'center'} maxWidth={600}>
            <Stack spacing={1} direction={dict.direction === 'ltr' ? 'row' : 'row-reverse'} sx={{ padding: 1 }} width='100%' position='static'>
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
            {
                tab && content ? <>
                    <Slider
                        aria-label="Page Number"
                        value={page}
                        onChange={(_e, value) => setPage(value)}
                        valueLabelDisplay="auto"
                        shiftStep={10}
                        step={1}
                        min={1}
                        max={tab?.totalPages}
                    />
                    <TextField
                        label={dict.page}
                        type="text"
                        value={page}
                        onChange={(e) => setPage(Number(e.target.value))}
                        sx={{
                            '& input': {
                                textAlign: 'center',
                            },
                        }}
                        size='small'
                    />
                    <Button variant={'text'} size={'large'} onClick={() => { if (page > 1) setPage(page - 1); }}>{getDirection(tab.sourceLanguage as LanguageOption) === 'ltr' ? <><ArrowBackTwoTone /> {dict.previous_page}</> : <> {dict.previous_page}<ArrowForwardTwoTone /></>}</Button>
                    <PdfPageReader sourceLang={tab.sourceLanguage} targetLang={tab.targetLanguage} content={content} pageNumber={page} tabId={id} />
                    <Button variant={'text'} size={'large'} onClick={() => { setPage(page + 1) }}>{getDirection(tab.sourceLanguage as LanguageOption) === 'rtl' ? <><ArrowBackTwoTone /> {dict.next_page}</> : <> {dict.next_page}<ArrowForwardTwoTone /></>}</Button>
                </> : ''
            }
        </Stack >
    );
};