// storage/LocalTabStorage.ts

import type { Tab } from "./Tab";
import type { TabStorage } from "./TabStorageInterface";

const KEY = 'my-tabs-list';

class LocalTabStorage implements TabStorage {
    async load(): Promise<Tab[]> {
        const json = localStorage.getItem(KEY);
        return json ? JSON.parse(json) : [];
    }

    async save(tabs: Tab[]): Promise<void> {
        localStorage.setItem(KEY, JSON.stringify(tabs));
    }
}

export default LocalTabStorage