import type { TranslationData } from "./models/TranslationData"

export type WordEntry = {
    word:string,
    translation:TranslationData,
    known:boolean,
    addedAt: Date,
    knownAt?: Date,
    timesAsked?: number
}