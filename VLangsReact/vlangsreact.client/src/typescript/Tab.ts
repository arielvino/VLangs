type Source = { type: 'local-pdf'; path: string; page: number }

export interface Tab {
    id: string;
    name: string;
    source: Source;
    sourceLanguage: string;
    targetLanguage: string;
}