import { useEffect, useState, useRef } from "react"
import { useTab } from "../../contexts/TabContext"
import WordSpan from "./Word"
import type { TranslationData } from "../../data/models/TranslationData"
import { useTheme, Box, Stack, CircularProgress, Typography } from "@mui/material"
import { getDirection, type LanguageOption } from "../activities/tab_creation/LanguageSelector"

const LearnableText: React.FC = () => {
    const tab = useTab()
    const theme = useTheme()
    const [translation, setTranslation] = useState<TranslationData | null>(null)
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
    const popupRef = useRef<HTMLDivElement>(null)

    const onWordClick = (translationData: TranslationData, sender: HTMLElement) => {
        setTranslation(translationData)
        const rect = sender.getBoundingClientRect()
        const x = rect.left + window.scrollX
        const y = rect.bottom + window.scrollY
        setCoords({ x, y })
    }

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setTranslation(null)
                setCoords(null)
            }
        }

        if (translation && coords) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [translation, coords])

    if (tab.isLoadingText) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                    Loading content...
                </Typography>
            </Box>
        )
    }

    if (tab.textError) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <Typography variant="h6" color="error">
                    Error Loading Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {tab.textError}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Unable to load the requested content.
                </Typography>
            </Box>
        )
    }

    if (!tab.text || tab.text.trim().length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    No content found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    The content appears to be empty or couldn't be extracted.
                </Typography>
            </Box>
        )
    }

    // Split text into paragraphs on empty lines
    const paragraphs = tab.text
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(Boolean)

    // Tokenize each paragraph
    const tokenizeParagraph = (paragraph: string) => {
        const tokens = paragraph.match(/(\p{L}+\p{M}*|\s+|[^\p{L}\p{M}\s])/gu) || []
        return tokens
    }

    return (
        <>
            <Stack spacing={2} dir={getDirection((tab.getSourceLanguage() || 'en') as LanguageOption)}>
                {paragraphs.map((paragraph, pIndex) => {
                    const tokens = tokenizeParagraph(paragraph)
                    return (
                        <Box
                            key={`p-${pIndex}`}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                rowGap: 0,
                                columnGap: 0,
                                maxWidth: '100%',
                                overflow: 'hidden',
                                wordBreak: 'break-word'
                            }}
                        >
                            {tokens.map((token, i) => {
                                if (/^\p{L}[\p{L}\p{M}]*$/u.test(token)) {
                                    return <WordSpan key={`w-${pIndex}-${i}`} word={token} showTranslationOnParent={onWordClick} />
                                } else {
                                    return (
                                        <span
                                            key={`nw-${pIndex}-${i}`}
                                            style={{
                                                display: 'inline',
                                                padding: 0,
                                                margin: 0,
                                                whiteSpace: 'pre-wrap'
                                            }}
                                        >
                                            {token}
                                        </span>
                                    )
                                }
                            })}
                            <Box flexGrow={1} />
                        </Box>
                    )
                })}
            </Stack>

            {translation && coords && (
                <div
                    ref={popupRef}
                    style={{
                        position: "absolute",
                        left: coords.x,
                        top: coords.y,
                        background: theme.palette.background.paper,
                        border: `2px solid ${theme.palette.primary.main}`,
                        borderRadius: theme.shape.borderRadius,
                        padding: theme.spacing(1),
                        zIndex: 1000,
                        boxShadow: theme.shadows[4],
                        maxWidth: '200px',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        setTranslation(null)
                        setCoords(null)
                    }}
                >
                    {translation.type === "text" ? (
                        <span
                            style={{
                                fontStyle: "italic",
                                color: theme.palette.primary.main,
                                display: "block",
                            }}
                        >
                            {translation.content}
                        </span>
                    ) : (
                        <span style={{ color: theme.palette.text.primary }}>
                            {JSON.stringify(translation)}
                        </span>
                    )}
                </div>
            )}
        </>
    )
}

export default LearnableText;
