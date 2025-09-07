// TextProvider.ts

import TesseractOCR from "../OCR/TesseractOCR";
import idbStorage from "./idbStorage";
import type { StorageInterface } from "./StorageInterface";


const storage: StorageInterface = idbStorage;

export class TextProvider {

    /**
     * Get page text: if cached, returns from storage; otherwise runs OCR, saves, then returns.
     */
    static async getPage(tabId: string, pageNumber: number): Promise<string | null> {
        // try cache first
        const cached = await storage.loadPageText(tabId, pageNumber);
        if (cached) return cached;

        // OCR fallback
        try {
            const tab = await storage.getTab(tabId);
            if (!tab) throw new Error("Tab not found");

            const fileContent = await storage.loadFile(tab.id);
            if (!fileContent || !(fileContent instanceof ArrayBuffer)) throw new Error("File content not found or invalid");

            let text: string;

            switch (tab.format) {
                case 'pdf': {
                    let result = await TesseractOCR.extractPdfPage(fileContent, pageNumber, tab.sourceLanguage);
                    if (!result) throw new Error("OCR failed to extract text");
                    text = result;
                    break;
                }
                default:
                    throw new Error("Unsupported format for OCR");
            }

            await storage.savePageText(tabId, pageNumber, text);
            return text;
        } catch (err) {
            console.error("OCR failed:", err);
            return null;
        }
    }
}