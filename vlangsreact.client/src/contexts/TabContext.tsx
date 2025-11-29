import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import type { WordEntry } from "../data/models/WordEntry"
import type { TranslationData } from "../data/models/TranslationData"
import type { TabInfo } from "../data/models/TabInfo"
import idbStorage from "../data/storage/idbStorage"
import type { StorageInterface } from "../data/storage/StorageInterface"
import { TextProvider } from "../data/storage/TextProvider"

const storage: StorageInterface = idbStorage

interface TabContextType {
    getTabId: () => string
    getWordEntry: (word: string) => Promise<WordEntry | null>
    getPageText: (page: number) => Promise<string>
    updateWordState: (word: string, newState: WordEntry) => void
    getTranslationOf: (word: string) => Promise<TranslationData>
    getSourceLanguage: () => string
    getTargetLanguage: () => string
}

const TabContext = createContext<TabContextType | null>(null)

export const useTab = () => {
    const ctx = useContext(TabContext)
    if (!ctx) throw new Error("useTab must be used inside TabProvider")
    return ctx
}

export const TabProvider = ({ tabId, children }: { tabId: string; children: ReactNode }) => {
    const [wordMap, setWordMap] = useState<Record<string, WordEntry>>({})
    const [tab, setTab] = useState<TabInfo | null>(null)

    if (!tabId) throw new Error("TabProvider requires a tabId");

    // Load tab info from storage
    useEffect(() => {
        storage.getTab(tabId).then((loadedTab) => {
            if (loadedTab) {
                setTab(loadedTab)
            }
        })

        // Load existing words for this tab
        storage.getWordEntriesByTab(tabId).then((entries) => {
            const map: Record<string, WordEntry> = {}
            entries.forEach(entry => {
                map[entry.word] = entry
            })
            setWordMap(map)
        })
    }, [tabId])

    const getTabId = () => {
        return tabId;
    }

    const getSourceLanguage = () => {
        return tab?.sourceLanguage || 'en'
    }

    const getTargetLanguage = () => {
        return tab?.targetLanguage || 'en'
    }

    const getPageText = async (page: number): Promise<string> => {
        try {
            // Use real storage via TextProvider
            storage.updateTab(tabId, { page })
            const text = await TextProvider.getPage(tabId, page)

            if (!text) {
                throw new Error("No content available for this page")
            }

            return text
        } catch (err) {
            console.error(`Error loading page ${page} for tab ${tabId}:`, err)
            throw err
        }
    }

    const getWordEntry = async (word: string): Promise<WordEntry | null> => {
        // Check memory cache first
        const existing = wordMap[word]
        if (existing) return existing

        // Check storage
        const entry = await storage.getWordForTab(tabId, word)
        if (entry) {
            setWordMap(prev => ({ ...prev, [word]: entry }))
            return entry
        }
        return null
    }

    const updateWordState = (word: string, newState: WordEntry) => {
        setWordMap(prev => ({ ...prev, [word]: newState }))
        storage.updateWordEntry(tabId, word, newState)
    }

    const getTranslationOf = async (word: string): Promise<TranslationData> => {
        const existing = wordMap[word]
        if (existing) return existing.translation

        const sourceLang = getSourceLanguage()
        const targetLang = getTargetLanguage()

        // Use real Google Translation API
        try {
            const res = await fetch(`/api/translate?engine=google&word=${encodeURIComponent(word)}&sourceLang=${encodeURIComponent(sourceLang)}&targetLang=${encodeURIComponent(targetLang)}`);

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Translation service unavailable' }));
                console.error('Translation failed:', errorData);
                throw new Error(errorData.error || 'Translation failed');
            }

            const responseData = await res.json();
            const translatedText = responseData.translation as string;

            const data: TranslationData = {
                type: "text",
                content: translatedText
            };

            // Create word entry
            const wordEntry: WordEntry = {
                tabId: getTabId(),
                word,
                translation: data,
                known: false,
                addedAt: new Date()
            }

            // Store in memory and database
            setWordMap(prev => ({ ...prev, [word]: wordEntry }))
            await storage.addWordEntry(wordEntry)

            return data;
        } catch (err) {
            console.error('Error fetching translation:', err);
            // Fallback: return the original word if translation fails
            const fallbackData: TranslationData = {
                type: "text",
                content: `[Translation unavailable: ${word}]`
            };
            return fallbackData;
        }
    }

    const contextValue = useMemo(
        () => ({ getTabId, getWordEntry, getPageText, updateWordState, getTranslationOf, getSourceLanguage, getTargetLanguage }),
        [tabId, tab]
    )

    return (
        <TabContext.Provider value={contextValue}>
            {children}
        </TabContext.Provider>
    )
}
