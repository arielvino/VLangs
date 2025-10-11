import React, { useState } from "react"
import { useTab } from "./TabContext"
import WordSpan from "./Word"

/**
 * Display text with optional highlighted words and translation.
 */
const LearnableText: React.FC = () => {
    const tab = useTab()
    const [text, setText] = useState<string | null>(null)

    React.useEffect(() => {
        tab.getPageText(1).then(setText)
    }, [tab])

    if (!text) return null

    // split into words and non-word separators
    const tokens = text.match(/(\p{L}+\p{M}*|[^\p{L}\p{M}\s])/gu) || []

    return (
        <span>
            {tokens.map((token, i) => {
                console.log(token)
                if (/^\p{L}[\p{L}\p{M}]*$/u.test(token)) {
                    return <WordSpan key={i} word={token} />
                } else {
                    return <span key={i}>{token}</span>
                }
            })}
        </span>
    )
}

export default LearnableText
