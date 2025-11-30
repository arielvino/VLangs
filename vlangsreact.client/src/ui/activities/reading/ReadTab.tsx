import { useEffect, useState } from "react";
import type { TabInfo } from "../../../data/models/TabInfo";
import { useDictionary } from "../../localization/Strings";
import { CircularProgress, useTheme } from "@mui/material";
import type { StorageInterface } from "../../../data/storage/StorageInterface";
import idbStorage from "../../../data/storage/idbStorage";
import { Button, IconButton, Slider, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ArrowBackRounded, ArrowBackTwoTone, ArrowForwardRounded, ArrowForwardTwoTone } from "@mui/icons-material";
import { getDirection, type LanguageOption } from "../tab_creation/LanguageSelector";
import { TabProvider } from "../../../contexts/TabContext";
import TextLoader from "./TextLoader";

const storage: StorageInterface = idbStorage;

interface ReadTabProps {
    tabId: string;
    onBackPressed: () => void;
}

export const ReadTab: React.FC<ReadTabProps> = ({ tabId, onBackPressed }) => {
    const [tab, setTab] = useState<TabInfo | undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const dict = useDictionary();
    const theme = useTheme();

    useEffect(() => {
        // Load tab once when tabId changes
        setIsLoading(true);
        storage.getTab(tabId).then((loadedTab) => {
            setTab(loadedTab);
            if (loadedTab) {
                setPage(loadedTab.page ?? 1);
            }
            setIsLoading(false);
        });
    }, [tabId]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        storage.updateTab(tabId, { page: newPage });
    };

    if (isLoading || !tab) {
        return (
            <Stack spacing={2} margin={2} alignItems="center">
                <CircularProgress color="secondary" />
                <Typography>Loading...</Typography>
            </Stack>
        );
    }

    return (
        <Stack
            spacing={3}
            sx={{
                margin: '0 auto',
                padding: { xs: 1, sm: 2 },
                alignItems: 'center',
                maxWidth: { xs: '100%', sm: '900px', md: '1000px' },
                width: '100%',
                boxSizing: 'border-box',
                overflowX: 'hidden'
            }}
        >
            {/* Header with title and back button */}
            <Stack
                spacing={2}
                direction={dict.direction === 'ltr' ? 'row' : 'row-reverse'}
                sx={{
                    padding: { xs: 1, sm: 2 },
                    width: '100%',
                    alignItems: 'center',
                    bgcolor: 'transparent',
                    borderRadius: 2,
                    boxShadow: 0,
                    boxSizing: 'border-box',
                    overflowX: 'hidden'
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
                    {tab.name}
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

            {/* Page controls */}
            <Box
                sx={{
                    width: '100%',
                    bgcolor: 'transparent',
                    borderRadius: 2,
                    p: { xs: 2, sm: 3 },
                    boxSizing: 'border-box',
                    overflowX: 'hidden'
                }}
            >
                <Stack spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%', maxWidth: '100%' }}>
                    <Slider
                        aria-label="Page Number"
                        value={page}
                        onChange={(_e, value) => handlePageChange(value as number)}
                        valueLabelDisplay="auto"
                        shiftStep={10}
                        step={1}
                        min={1}
                        max={tab.totalPages || 100}
                        sx={{
                            width: '100%',
                            '& .MuiSlider-thumb': {
                                width: 20,
                                height: 20
                            }
                        }}
                    />
                    <Box sx={{
                        display: 'flex',
                        gap: { xs: 0.5, sm: 1 },
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        width: '100%',
                        maxWidth: '100%'
                    }}>
                        <Button
                            variant={'contained'}
                            size={'small'}
                            onClick={() => { if (page > 1) handlePageChange(page - 1); }}
                            disabled={page <= 1}
                            sx={{
                                textTransform: 'none',
                                minWidth: { xs: 80, sm: 120 },
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                px: { xs: 1, sm: 2 }
                            }}
                        >
                            {getDirection((tab.sourceLanguage || 'en') as LanguageOption) === 'ltr' ? (
                                <><ArrowBackTwoTone sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} /> {dict.previous_page}</>
                            ) : (
                                <>{dict.previous_page} <ArrowForwardTwoTone sx={{ ml: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} /></>
                            )}
                        </Button>
                        <TextField
                            label={dict.page}
                            type="text"
                            value={page}
                            onChange={(e) => handlePageChange(Number(e.target.value))}
                            sx={{
                                width: { xs: 70, sm: 100 },
                                '& input': {
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.9rem', sm: '1.1rem' }
                                },
                            }}
                            size='small'
                        />
                        <Button
                            variant={'contained'}
                            size={'small'}
                            onClick={() => { if (page < (tab.totalPages || 100)) handlePageChange(page + 1); }}
                            disabled={page >= (tab.totalPages || 100)}
                            sx={{
                                textTransform: 'none',
                                minWidth: { xs: 80, sm: 120 },
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                px: { xs: 1, sm: 2 }
                            }}
                        >
                            {getDirection((tab.sourceLanguage || 'en') as LanguageOption) === 'rtl' ? (
                                <><ArrowBackTwoTone sx={{ mr: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} /> {dict.next_page}</>
                            ) : (
                                <>{dict.next_page} <ArrowForwardTwoTone sx={{ ml: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} /></>
                            )}
                        </Button>
                    </Box>
                </Stack>
            </Box>

            {/* Content area */}
            <Box
                sx={{
                    width: '100%',
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 3,
                    p: { xs: 2, sm: 4 },
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: 3,
                    minHeight: 400,
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    overflowY: 'auto'
                }}
            >
                <TabProvider tabId={tabId}>
                    <TextLoader page={page} />
                </TabProvider>
            </Box>
        </Stack>
    );
};
