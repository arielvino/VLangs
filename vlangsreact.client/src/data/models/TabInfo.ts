export type SourceType = 'local'// | 'remote';
export type Format = 'pdf'// |'epub' | 'paste';

export interface TabInfo {
    id: string;
    name: string;
    sourceLanguage: string;
    targetLanguage: string;
    sourceType: SourceType;
    format: Format;
    page: number;
    totalPages: number;
    sourceHint?: string; // e.g. file name or URL
}