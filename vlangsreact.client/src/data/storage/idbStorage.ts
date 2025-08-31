import type { TabInfo } from "../models/TabInfo";
import { openDB, type DBSchema } from 'idb';
import type { WordEntry } from "../models/WordEntry";
import type { StorageInterface } from "./StorageInterface";

interface AppDB extends DBSchema {
    tabs: {
        key: string;
        value: TabInfo;
    };
    files: {
        key: string;
        value: ArrayBuffer;
    };
    words: {
        key: [string, string];
        value: WordEntry;
        indexes: { 'by-tab': string };
    };
}

const DB_NAME = 'lang-reader-db';

const dbPromise =()=> openDB<AppDB>(DB_NAME, 1, {
    upgrade(db) {
        db.createObjectStore('tabs', { keyPath: 'id' });
        db.createObjectStore('files');
        const wordStore = db.createObjectStore('words', { keyPath: ['tabId', 'word'] });
        wordStore.createIndex('by-tab', 'tabId');
    },
});

class IdbStorage implements StorageInterface {
    async addTab(tab: TabInfo): Promise<boolean> {
        const db = await dbPromise();
        await db.add('tabs', tab);
        return true;
    }

    async getTabs(): Promise<TabInfo[]> {
        const db = await dbPromise();
        return await db.getAll('tabs');
    }

    async getTab(id: string): Promise<TabInfo | undefined> {
        const db = await dbPromise();
        return await db.get('tabs', id);
    }

    async updateTab(id: string, updates: Partial<TabInfo>): Promise<boolean> {
        const db = await dbPromise();
        const tab = await db.get('tabs', id);
        if (tab) {
            await db.put('tabs', { ...tab, ...updates });
            return true;
        }
        return false;
    }

    async deleteTab(id: string): Promise<boolean> {
        const db = await dbPromise();
        await db.delete('tabs', id);
        await db.delete('files', id);
        this.deleteWordsByTab(id);
        return true;
    }

    async saveFile(id: string, buffer: ArrayBuffer): Promise<boolean> {
        const db = await dbPromise();
        await db.put('files', buffer, id);
        return true;
    }

    async loadFile(id: string): Promise<ArrayBuffer | undefined> {
        const db = await dbPromise();
        return await db.get('files', id);
    }

    async addWordEntry(entry: WordEntry): Promise<boolean> {
        const db = await dbPromise();
        await db.add('words', entry);
        return true;
    }

    async updateWordEntry(tabId: string, word: string, updates: Partial<WordEntry>): Promise<boolean> {
        const db = await dbPromise();
        const key: [string, string] = [tabId, word];
        const entry = await db.get('words', key);
        if (!entry) return false;

        const updated = { ...entry, ...updates };
        await db.put('words', updated);
        return true;
    }

    async deleteWordEntry(tabId: string, word: string): Promise<boolean> {
        const db = await dbPromise();
        const key: [string, string] = [tabId, word];
        await db.delete('words', key);
        return true;
    }

    async getWordForTab(tabId: string, word: string): Promise<WordEntry | undefined> {
        const db = await dbPromise();
        return await db.get('words', [tabId, word]);
    }

    async getWordsByTab(tabId: string): Promise<string[]> {
        const db = await dbPromise();
        const index = db.transaction('words').store.index('by-tab');
        const words: string[] = [];

        for await (const cursor of index.iterate(tabId)) {
            words.push(cursor.value.word);
        }

        return words;
    }

    async getWordEntriesByTab(tabId: string): Promise<WordEntry[]> {
        const db = await dbPromise();
        return await db.getAllFromIndex('words', 'by-tab', tabId);
    }

    async deleteWordsByTab(tabId: string): Promise<boolean> {
        const db = await dbPromise();
        const tx = db.transaction('words', 'readwrite');
        const index = tx.store.index('by-tab');
        for await (const cursor of index.iterate(tabId)) {
            cursor.delete();
        }
        await tx.done;
        return true;
    }
}

export default new IdbStorage();