import { useTab } from "../../contexts/TabContext"
import { useEffect, useState } from "react"
import WordSpan from "./Word"
import type { TranslationData } from "../../data/models/TranslationData"
import { useTheme } from "@mui/material"

interface LearnableTextProps {
    page?: number
}

const LearnableText: React.FC<LearnableTextProps> = ({ page = 1 }) => {
    const theme = useTheme()
    const tab = useTab()
    const [text, setText] = useState<string | null>(null)
    const [translation, setTranslation] = useState<TranslationData | null>(null)
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)

    const onWordClick = (translationData: TranslationData, sender: HTMLElement) => {
        setTranslation(translationData)
        const rect = sender.getBoundingClientRect()
        setCoords({ x: rect.left, y: rect.bottom })
    }

    useEffect(() => {
        setText(null) // Clear old text while loading
        tab.getPageText(page).then(setText)
    }, [tab, page])

    if (!text) return null

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
