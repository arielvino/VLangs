export interface WordEntry {
    tabId: string;
    word: string;
    translation?: string;
    timesAsked: number;
    known: boolean;
}