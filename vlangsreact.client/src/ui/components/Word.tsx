import React, { useEffect, useState } from "react"
import { useTab } from "../../contexts/TabContext"
import { useTheme } from "@mui/material"
import type { WordEntry } from "../../data/models/WordEntry"
import { Box } from "@mui/system"
import type { TranslationData } from "../../data/models/TranslationData"

const WordSpan: React.FC<{ word: string, showTranslationOnParent: (translation: TranslationData, sender: HTMLElement) => void }> = ({ word, showTranslationOnParent }) => {
    const tab = useTab()
    const theme = useTheme()
    const [wordEntry, setWordEntry] = useState<WordEntry | null>(null)

    const determineBgColor = (wordEntry: WordEntry | null) => {
        if (!wordEntry)
            return 'inherit';

        return wordEntry.known ? theme.palette.success.main : theme.palette.error.main;
    }

    const handleClick = async (e: React.MouseEvent<HTMLSpanElement>) => {
        const sender = e.currentTarget  // store immediately

        if (!wordEntry) {
            // ...
        } else {
            // ...
        }

        const translation = await tab.getTranslationOf(word)
        showTranslationOnParent(translation, sender)
    }

    useEffect(() => {
        let mounted = true
        const load = async () => {
            const entry = await tab.getWordEntry(word)
            if (mounted) setWordEntry(entry)
        }
        load()
        return () => { mounted = false }
    }, [])

    return (<Box
        component="span"
        alignItems="center"
        sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: determineBgColor(wordEntry),
            marginRight: "0.1em",
            borderRadius: "0.25em",
            padding: "0.05em 0.02em",
            cursor: "pointer",
            transition: "all 0.1s ease-out",
            ":hover": {
                bgcolor: wordEntry ? determineBgColor(wordEntry) : theme.palette.primary.main,
                transform: "scale(1.1)",
                boxShadow: 1
            }
        }}
        onClick={handleClick}
    >
        {word}
    </Box>)
}

export default WordSpan;