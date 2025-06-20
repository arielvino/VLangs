// components/TabsManager.tsx
import React, { useEffect, useState } from 'react';
import type { Tab } from './typescript/Tab';
import { storageManager } from './typescript/TabStorageInterface';
import PdfPageReader from './PdfPageReader';
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { type LanguageOption } from './Language';
import { languages } from './Language';
import LanguageSelect from './Language';
import FileUpload from './FileUpload';
import { KeyboardDoubleArrowRight } from '@mui/icons-material';
import { loadFile, saveFile } from './typescript/FileStorage';

const TabsManager: React.FC = () => {
    type Activity = { name: 'list' } | { name: 'read', id: string } | { name: 'create' }

    const [activity, setActivity] = useState<Activity>({ name: 'list' });

    return (
        <>
            {
                (() => {
                    switch (activity.name) {
                        case 'create':
                            return (
                                <TabCreation
                                    onCreate={() => setActivity({ name: 'list' })}
                                    onCancel={() => setActivity({ name: 'list' })}
                                />
                            );
                        case 'list':
                            return (
                                <TabsList
                                    createPressed={() => setActivity({ name: 'create' })}
                                    navigateToTab={(id) => setActivity({ name: 'read', id })}
                                />
                            );
                        case 'read':
                            return <ReadTab id={activity.id} onBackPressed={() => setActivity({ name: 'list' })} />;
                    }
                })()
            }
        </>
    );
}

interface TabsListProps {
    createPressed: () => void;
    navigateToTab: (id: string) => void;
}

const TabsList: React.FC<TabsListProps> = ({ createPressed, navigateToTab }) => {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        storageManager.load().then(tabs => {
            setTabs(tabs);
            setLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (loaded) {
            storageManager.save(tabs);
        }
    }, [tabs]);

    const removeTab = (id: string) => {
        setTabs(tabs.filter(t => t.id !== id));
    };

    return (
        <Stack spacing={2}>
            <h3>Tabs</h3>
            {tabs.map(tab => (
                <TabListItem key={tab.id} tab={tab} onSelected={navigateToTab} onDeletePressed={removeTab}></TabListItem>
            ))}

            <Button onClick={createPressed}>Create New Tab</Button>
        </Stack>
    );
}

interface TabListItemProp {
    tab: Tab,
    onSelected: (id: string) => void
    onDeletePressed: (id: string) => void
}

const TabListItem: React.FC<TabListItemProp> = (prop) => {
    return (
        <Box
            key={prop.tab.id}
            onClick={() => prop.onSelected(prop.tab.id)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', // space between left and right groups
                padding: 1,
                gap: 1,
                border: '1px solid',
                borderColor: 'primary.main'
            }}
        >
            <Typography
                variant="body1"
                sx={{ fontSize: 20, color: 'secondary.main' }}
            >
                {prop.tab.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{prop.tab.sourceLanguage}</span>
                <KeyboardDoubleArrowRight fontSize="small" />
                <span>{prop.tab.targetLanguage}</span>
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation(); // prevent triggering parent onClick
                        prop.onDeletePressed(prop.tab.id);
                    }}
                    aria-label="delete"
                    size="small"
                    color="error"
                >
                    <DeleteOutlined fontSize="small" />
                </IconButton>
            </Box>
        </Box>

    );
}

interface TabCreationProps {
    onCreate: () => void;
    onCancel: () => void;
}

const TabCreation: React.FC<TabCreationProps> = ({ onCreate, onCancel }) => {
    const [newTabName, setNewTabName] = useState('');
    const [newTabPath, setNewTabPath] = useState('');
    const [targetLanguage, setTargetLanguage] = useState<LanguageOption>(languages[0]);
    const [sourceLanguage, setSourceLanguage] = useState<LanguageOption>(languages[0]);
    const [file, setFile] = useState<File | null>(null);
    const [isInputValid, setInputValid] = useState(false);

    useEffect(() => {
        setInputValid(validateInput());
    }, [newTabName, targetLanguage, sourceLanguage]);

    const validateInput = () => {
        try {
            JSON.stringify({ name: newTabName });
            if (newTabName.trim() === '') {
                return false;
            }
        } catch {
            return false;
        }

        if (sourceLanguage == targetLanguage) {
            return false;
        }

        return true;
    }

    return (
        <Stack spacing={2}>
            <TextField
                label="Tab Name"
                fullWidth
                value={newTabName}
                onChange={e => setNewTabName(e.target.value.trim())}
            />
            <FileUpload
                onFileSelect={file => {
                    setNewTabPath(file.webkitRelativePath || file.name);
                    setFile(file);
                }}
            />
            <LanguageSelect
                label="Source language"
                value={sourceLanguage}
                onChange={setSourceLanguage}
            />
            <LanguageSelect
                label="Target language"
                value={targetLanguage}
                onChange={setTargetLanguage}
            />
            <Button
                onClick={() => {
                    const tab: Tab = {
                        id: Date.now().toString(),
                        name: newTabName,
                        source: { type: 'local-pdf', path: newTabPath, page: 1 },
                        sourceLanguage: sourceLanguage.code,
                        targetLanguage: targetLanguage.code,
                    };

                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = async () => {
                        const result = reader.result;
                        if (result instanceof ArrayBuffer) {
                            await saveFile(tab.id, result);
                            let tabs = storageManager.load().then((tabs) => {
                                storageManager.save([tab, ...tabs]).then(() => {
                                    onCreate();
                                });
                            });
                        }
                    };
                    reader.readAsArrayBuffer(file);

                }}
                variant="contained"
                disabled={!isInputValid}
            >
                Add
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
        </Stack >
    );
};

interface ReadTabProps {
    id: string;
    onBackPressed: () => void;
}

const ReadTab: React.FC<ReadTabProps> = ({ id, onBackPressed }) => {
    const [tab, setTab] = useState<Tab | null>(null);
    const [page, setPage] = useState<number>(1);
    const [content, setContent] = useState<ArrayBuffer | null>(null);

    useEffect(() => {
        storageManager.load().then(tabs => {
            const found = tabs.find(t => t.id === id);
            setTab(found || null);
        });
    }, [id]);

    useEffect(() => {
        if (tab?.source.type === 'local-pdf') {
            loadFile(tab.id)
                .then(data => {
                    if (data) {
                        if (data instanceof ArrayBuffer) {
                            setContent(data);
                        }
                    } else {
                        console.error('File not found in IndexedDB');
                    }
                })
                .catch(err => {
                    console.error('Error loading file:', err);
                });
        }
    }, [tab]);

    if (!tab) return <div>Loading...</div>;

    if (tab.source.type !== 'local-pdf') {
        return <div>Unsupported source type</div>;
    }

    return (
        <Stack spacing={2} margin={2}>
            <Button variant={'contained'} onClick={onBackPressed}>Back</Button>
            <TextField
                label="Page"
                type="number"
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                fullWidth
            />
            {content ? <PdfPageReader content={content} pageNumber={page} /> : ''}
        </Stack>
    );
};

export default TabsManager;