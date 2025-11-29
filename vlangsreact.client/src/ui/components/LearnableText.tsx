import { useTab } from "../../contexts/TabContext"
import { useEffect, useState } from "react"
import WordSpan from "./Word"
import type { TranslationData } from "../../data/models/TranslationData"
import { useTheme, CircularProgress, Typography, Box } from "@mui/material"

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

    const onWordClick = (translationData: TranslationData, sender: HTMLElement) => {
        setTranslation(translationData)
        const rect = sender.getBoundingClientRect()
        setCoords({ x: rect.left, y: rect.bottom })
    }

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

    const tokens = text.match(/(\p{L}+\p{M}*|[^\p{L}\p{M}\s])/gu) || []

    return (
        <span>
            {tokens.map((token, i) => {
                if (/^\p{L}[\p{L}\p{M}]*$/u.test(token)) {
                    return <WordSpan key={i} word={token} showTranslationOnParent={onWordClick} />
                } else {
                    return <span key={i}>{token}</span>
                }
            })}

            {translation && coords && (
                <div
                    style={{
                        position: "absolute",
                        left: coords.x,
                        top: coords.y,
                        background: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.text.primary}`,
                        borderRadius: theme.shape.borderRadius,
                        padding: theme.spacing(0.5),
                        zIndex: 1000,
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
        </span>
    )
}

export default LearnableText;
