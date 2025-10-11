import React, { useEffect, useState } from "react"
import { useTab } from "./TabContext"
import { useTheme } from "@mui/material"
import type { WordEntry } from "../data/models/WordEntry"
import { Box } from "@mui/system"

const WordSpan: React.FC<{ word: string }> = ({ word }) => {
    const tab = useTab()
    const theme = useTheme()
    const [wordEntry, setWordEntry] = useState<WordEntry | null>(null)

    const determineBgColor = (wordEntry: WordEntry | null) => {
        if (!wordEntry)
            return 'inherit';

        return wordEntry.known ? theme.palette.success.main : theme.palette.error.main;
    }
    const determineHoverBgColor = (wordEntry: WordEntry | null) => {
        return wordEntry ? 'inherit' : theme.palette.primary.main;
    }

    const handleClick = () => {
        if (!wordEntry) {

        }
        else {
        }
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
            margin: "0.25em",
            borderRadius: "0.25em",
            padding: "0.05em 0.02em",
            ":hover": { bgcolor: determineHoverBgColor(wordEntry) }
        }}
        onClick={handleClick}
    >
        {word}
    </Box>)
}

export default WordSpan;