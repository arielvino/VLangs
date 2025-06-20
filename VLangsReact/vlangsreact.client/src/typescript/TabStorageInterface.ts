import type { Tab } from "./Tab";
import TabsStorageInLocalStorage from "./TabsStorageInLocalStorage";

export interface TabStorage {
    load(): Promise<Tab[]>;
    save(tabs: Tab[]): Promise<void>;
}

export const storageManager = new TabsStorageInLocalStorage();