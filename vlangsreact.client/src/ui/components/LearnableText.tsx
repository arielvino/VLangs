import { useTab } from "../../contexts/TabContext"
import { useEffect, useState, useRef } from "react"
import WordSpan from "./Word"
import type { TranslationData } from "../../data/models/TranslationData"
import { useTheme, CircularProgress, Typography, Box, Stack } from "@mui/material"

interface LearnableTextProps {
    page?: number
}

const LearnableText: React.FC<LearnableTextProps> = ({ page = 1 }) => {
    const theme = useTheme()
    const tab = useTab()
    const [text, setText] = useState<string | null>(null)
    const [translation, setTranslation] = useState<TranslationData | null>(null)
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const popupRef = useRef<HTMLDivElement>(null)

    const onWordClick = (translationData: TranslationData, sender: HTMLElement) => {
        setTranslation(translationData)
        const rect = sender.getBoundingClientRect()
        // Position popup below the word, using absolute positioning to scroll with page
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

    useEffect(() => {
        setText(null) // Clear old text while loading
        setIsLoading(true)
        setError(null)

        tab.getPageText(page)
            .then((loadedText) => {
                console.log('Page text loaded:', loadedText?.substring(0, 100))
                setText(loadedText)
                setIsLoading(false)
            })
            .catch((err) => {
                console.error('Failed to load page text:', err)
                setError(err.message || 'Failed to load page content')
                setIsLoading(false)
            })
    }, [tab, page])

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                    Loading page {page}...
                </Typography>
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <Typography variant="h6" color="error">
                    Error Loading Page
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {error}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Make sure you have uploaded a PDF file for this tab.
                </Typography>
            </Box>
        )
    }

    if (!text || text.trim().length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    No content found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    This page appears to be empty or the OCR couldn't extract any text.
                </Typography>
            </Box>
        )
    }

    // Split text into paragraphs on empty lines (double newlines)
    const paragraphs = text
        .split(/\n\s*\n/) // split on empty line
        .map(p => p.trim())
        .filter(Boolean)

    // Tokenize each paragraph
    const tokenizeParagraph = (paragraph: string) => {
        const tokens = paragraph.match(/(\p{L}+\p{M}*|[^\p{L}\p{M}\s])/gu) || []
        return tokens
    }

    return (
        <>
            <Stack spacing={2}>
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
                                columnGap: 0.1,
                                maxWidth: '100%',
                                overflow: 'hidden',
                                wordBreak: 'break-word'
                            }}
                        >
                            {tokens.map((token, i) => {
                                if (/^\p{L}[\p{L}\p{M}]*$/u.test(token)) {
                                    return <WordSpan key={`w-${pIndex}-${i}`} word={token} showTranslationOnParent={onWordClick} />
                                } else {
                                    return <span key={`nw-${pIndex}-${i}`}>{token}</span>
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
