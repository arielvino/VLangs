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
import LearnableText from "../../components/LearnableText";

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
        <Stack spacing={2} margin={2} alignItems={'center'} maxWidth={600}>
            <Stack spacing={1} direction={dict.direction === 'ltr' ? 'row' : 'row-reverse'} sx={{ padding: 1 }} width='100%' position='static'>
                <Typography variant="h6" textAlign={'center'}>{tab.name}</Typography>
                <Box flexGrow={1} />
                <IconButton onClick={onBackPressed} sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.background.paper,
                    ":hover": {
                        bgcolor: theme.palette.primary.main + ' !important',
                    }
                }}>{dict.direction === 'ltr' ? <ArrowBackRounded /> : <ArrowForwardRounded />}</IconButton>
            </Stack>

            <Slider
                aria-label="Page Number"
                value={page}
                onChange={(_e, value) => handlePageChange(value as number)}
                valueLabelDisplay="auto"
                shiftStep={10}
                step={1}
                min={1}
                max={tab.totalPages || 100}
            />
            <TextField
                label={dict.page}
                type="text"
                value={page}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                sx={{
                    '& input': {
                        textAlign: 'center',
                    },
                }}
                size='small'
            />
            <Button variant={'text'} size={'large'} onClick={() => { if (page > 1) handlePageChange(page - 1); }}>
                {getDirection((tab.sourceLanguage || 'en') as LanguageOption) === 'ltr' ? <><ArrowBackTwoTone /> {dict.previous_page}</> : <> {dict.previous_page}<ArrowForwardTwoTone /></>}
            </Button>

            {/* Use TabProvider with LearnableText */}
            <TabProvider tabId={tabId}>
                <LearnableText page={page} />
            </TabProvider>

            <Button variant={'text'} size={'large'} onClick={() => { handlePageChange(page + 1) }}>
                {getDirection((tab.sourceLanguage || 'en') as LanguageOption) === 'rtl' ? <><ArrowBackTwoTone /> {dict.next_page}</> : <> {dict.next_page}<ArrowForwardTwoTone /></>}
            </Button>
        </Stack >
    );
};
