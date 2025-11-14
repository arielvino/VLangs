import type { TranslationProviderType } from "../storage/TranslationProviderType"

export type TabInfo =
    | BookTabInfo
    | AdventureTabInfo
    | NoobsTabInfo

interface BaseTabInfo {
    id: string
    title: string
    mode: "book" | "adventure" | "noobs"

    translationProvider: TranslationProviderType

    createdAt: Date
    lastOpenedAt: Date
}

export interface BookTabInfo extends BaseTabInfo {
    mode: "book"
    modeProps: {
        sourcePath: string
        currentPage: number
        totalPages: number
    }
}

export interface AdventureTabInfo extends BaseTabInfo {
    mode: "adventure"
    modeProps: {
        storySeed: string
        currentSceneId: string
        choicesMade: string[]
        currentChoices?:string[]
    }
}

export interface NoobsTabInfo extends BaseTabInfo {
    mode: "noobs"
    modeProps: {
        difficulty: "easy" | "medium" | "hard"
    }
}