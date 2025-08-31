import type { TabInfo } from "../models/TabInfo";
import type { WordEntry } from "../models/WordEntry";

export interface StorageInterface {
    // Tabs
    addTab(tab: TabInfo): Promise<boolean>;
    getTabs(): Promise<TabInfo[]>;
    getTab(id: string): Promise<TabInfo | undefined>;
    updateTab(id: string, updates: Partial<TabInfo>): Promise<boolean>;
    deleteTab(id: string): Promise<boolean>;

    // Files
    saveFile(id: string, buffer: ArrayBuffer): Promise<boolean>;
    loadFile(id: string): Promise<ArrayBuffer | undefined>;

    // Words
    addWordEntry(entry: WordEntry): Promise<boolean>;
    updateWordEntry(tabId: string, word: string, updates: Partial<WordEntry>): Promise<boolean>;
    deleteWordEntry(tabId: string, word: string): Promise<boolean>;

    getWordForTab(tabId: string, word: string): Promise<WordEntry | undefined>;
    getWordsByTab(tabId: string): Promise<string[]>;
    getWordEntriesByTab(tabId: string): Promise<WordEntry[]>;
    deleteWordsByTab(tabId: string): Promise<boolean>;
}