import React, { useEffect, useState } from 'react';
import type { TabInfo } from '../data/models/TabInfo';
import { Button, IconButton, Stack, TextField, Typography, useTheme } from '@mui/material';
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