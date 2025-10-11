import { createContext, useContext, useState, type ReactNode } from "react"
import type { WordEntry } from "../data/models/WordEntry"

interface TabContextType {
    getWordEntry: (word: string) => Promise<WordEntry|null>
    getPageText: (page: number) => Promise<string>
    updateWordState: (word: string, newState: WordEntry) => void
    getTranslationOf: (word: string) => Promise<string>
}

const TabContext = createContext<TabContextType | null>(null)

export const useTab = () => {
    const ctx = useContext(TabContext)
    if (!ctx) throw new Error("useTab must be used inside TabProvider")
    return ctx
}

export const TabProvider = ({ tabId, children }: { tabId: string; children: ReactNode }) => {
    const [wordMap, setWordMap] = useState<Record<string, WordEntry>>({})

    if (!tabId) throw new Error("TabProvider requires a tabId")

    // mock text source per page
    const mockPages: Record<number, string> = {
        1: `Die Katze sitzt auf dem Dach, während der Hund unten im Garten spielt. 
Am Nachmittag geht er spazieren, und die Vögel singen fröhlich in den Bäumen. 
„Guten Morgen!“, rief die Nachbarin freundlich, als sie vorbeiging.

Am nächsten Tag beschloss die Familie, einen Ausflug in den Wald zu machen. 
Die Kinder sammelten bunte Blätter, und die Sonne schien warm auf ihr Gesicht.

Abends setzten sie sich ans Fenster und betrachteten den Sonnenuntergang, während der Wind sanft durch die Bäume wehte.`,
        2: "The villagers worked hard every day under the bright sun.",
    }

    const getPageText = async (page: number) => {
        // simulate async text retrieval (from cache, db, or remote)
        await new Promise(r => setTimeout(r, 100))
        return mockPages[page] || "(no text found)"
    }

    const getWordEntry = async (word: string): Promise<WordEntry|null> => {
        // simulate cache lookup or remote fetch
        const existing = wordMap[word]
        if (existing) return existing

        // placeholder entry
        const entry: WordEntry = {
            word,
            translation: "(not translated yet)",
            tabId: "",
            timesAsked: 0,
            known: true
        }

        setWordMap(prev => ({ ...prev, [word]: entry }))
        return null
    }

    const updateWordState = (word: string, newState: WordEntry) => {
        setWordMap(prev => ({ ...prev, [word]: newState }))
    }

    const getTranslationOf = async (word: string): Promise<string> => {
        // simulate translation lookup
        await new Promise(r => setTimeout(r, 80))
        const translated = word.split("").reverse().join("") // mock translation
        setWordMap(prev => ({
            ...prev,
            [word]: { ...(prev[word] || { word, state: "unknown" }), translation: translated },
        }))
        return translated
    }

    return (
        <TabContext.Provider value={{ getWordEntry, getPageText, updateWordState, getTranslationOf }}>
            {children}
        </TabContext.Provider>
    )
}
