import type { TranslationData } from "../new/TranslationData"

export type WordEntry = {
    word:string,
    translation:TranslationData,
    known:boolean,
    addedAt: Date,
    knownAt?: Date,
    timesAsked?: number
}