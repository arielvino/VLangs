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
import TextReader from "./TextReader";
import { TextProvider } from "../../../data/storage/TextProvider";
import InfoComponent from "../../reusables/InfoComponent";

const storage: StorageInterface = idbStorage;

interface ReadTabProps {
    tabId: string;
    onBackPressed: () => void;
}

export const ReadTab: React.FC<ReadTabProps> = ({ tabId, onBackPressed }) => {
    const [tab, setTab] = useState<TabInfo | undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    const [text, setText] = useState<string | null>(null);

    const dict = useDictionary();
    const theme = useTheme();

    useEffect(() => {
        // Load tab once when tabId changes
        storage.getTab(tabId).then((loadedTab) => {
            setTab(loadedTab);
            if (loadedTab) {
                setPage(loadedTab.page ?? 1); // restore last saved page
            }
        });
    }, [tabId]);

    useEffect(() => {
        if (!tab) return; // wait until tab is loaded

        setText(null);
        storage.updateTab(tabId, { page });
        TextProvider.getPage(tabId, page).then(setText);
    }, [tab, page, tabId]);

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
                tab ? <>
                    <Slider
                        aria-label="Page Number"
                        value={page}
                        onChange={(_e, value) => setPage(value)}
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
                        onChange={(e) => setPage(Number(e.target.value))}
                        sx={{
                            '& input': {
                                textAlign: 'center',
                            },
                        }}
                        size='small'
                    />
                    <Button variant={'text'} size={'large'} onClick={() => { if (page > 1) setPage(page - 1); }}>{getDirection((tab.sourceLanguage || 'en') as LanguageOption) === 'ltr' ? <><ArrowBackTwoTone /> {dict.previous_page}</> : <> {dict.previous_page}<ArrowForwardTwoTone /></>}</Button>
                    {text ? <TextReader sourceLanguage={tab.sourceLanguage || 'en'} targetLanguage={tab.targetLanguage || 'en'} tabId={tabId} paragraphs={text
                        .split(/\n\s*\n/) // split on empty line
                        .map(p => p.trim())
                        .filter(Boolean)} /> : <>
                        <CircularProgress color="secondary" />
                            <InfoComponent message={dict.first_time_page_loaded_message} />
                    </>}
                    <Button variant={'text'} size={'large'} onClick={() => { setPage(page + 1) }}>{getDirection((tab.sourceLanguage || 'en') as LanguageOption) === 'rtl' ? <><ArrowBackTwoTone /> {dict.next_page}</> : <> {dict.next_page}<ArrowForwardTwoTone /></>}</Button>
                </> : ''
            }
        </Stack >
    );
};