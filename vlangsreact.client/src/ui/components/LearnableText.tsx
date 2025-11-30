import { useEffect, useState, useRef } from "react"
import WordSpan from "./Word"
import type { TranslationData } from "../../data/models/TranslationData"
import { useTheme, Box, Stack } from "@mui/material"

interface LearnableTextProps {
    text: string
}

const LearnableText: React.FC<LearnableTextProps> = ({ text }) => {
    const theme = useTheme()
    const [translation, setTranslation] = useState<TranslationData | null>(null)
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
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

    // Split text into paragraphs on empty lines (double newlines)
    const paragraphs = text
        .split(/\n\s*\n/) // split on empty line
        .map(p => p.trim())
        .filter(Boolean)

    // Tokenize each paragraph
    const tokenizeParagraph = (paragraph: string) => {
        // Match words, whitespace sequences, and punctuation separately
        const tokens = paragraph.match(/(\p{L}+\p{M}*|\s+|[^\p{L}\p{M}\s])/gu) || []
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
                                columnGap: 0,
                                maxWidth: '100%',
                                overflow: 'hidden',
                                wordBreak: 'break-word'
                            }}
                        >
                            {tokens.map((token, i) => {
                                if (/^\p{L}[\p{L}\p{M}]*$/u.test(token)) {
                                    // It's a word
                                    return <WordSpan key={`w-${pIndex}-${i}`} word={token} showTranslationOnParent={onWordClick} />
                                } else if (/^\s+$/.test(token)) {
                                    // It's whitespace - preserve it
                                    return <span key={`ws-${pIndex}-${i}`}>{token}</span>
                                } else {
                                    // It's punctuation or other characters
                                    return (
                                        <span
                                            key={`nw-${pIndex}-${i}`}
                                            style={{
                                                display: 'inline',
                                                padding: 0,
                                                margin: 0
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
