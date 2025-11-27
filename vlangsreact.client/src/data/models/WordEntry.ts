import type { TranslationData } from "../../new/TranslationData"

export type WordEntry = {
    tabId: string
    word: string
    translation: TranslationData
    known: boolean
    addedAt: Date
    knownAt?: Date
    timesAsked?: number
}
