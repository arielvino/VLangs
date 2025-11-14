import type { TranslationData } from "./TranslationData"

export type WordEntry = {
    word:string,
    translation:TranslationData,
    known:boolean,
    addedAt: Date,
    knownAt?: Date,
}