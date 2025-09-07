export default interface InterfaceOCR {
    extractPdfPage(fileData: ArrayBuffer, pageNumber: number, sourceLanguage: string) : Promise<string | null>
}