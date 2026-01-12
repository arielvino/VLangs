import type InterfaceOCR from './InterfaceOCR';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import Tesseract from 'tesseract.js';

// Use CDN for PDF.js worker to reduce bundle size
GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs';


class TesseractOCR implements InterfaceOCR {
    getTesseractLang(code: string): string {
        const map: Record<string, string> = {
            en: 'eng',
            de: 'deu',
            fr: 'fra',
            es: 'spa',
            ar: 'ara',
            ru: 'rus',
            he: 'heb',
        };
        return map[code] || 'eng';
    }

    async extractPdfPage(
        fileData: ArrayBuffer,
        pageNumber: number,
        sourceLanguage: string
    ): Promise<string | null> {
        try {
            const pdfDocument: PDFDocumentProxy = await getDocument({ data: fileData }).promise;
            const pageContent = await pdfDocument.getPage(pageNumber);

            // render page to canvas
            const viewport = pageContent.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d")!;
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await pageContent.render({ canvasContext: context, canvas, viewport }).promise;

            // run OCR
            // const { data } = await Tesseract.recognize(
            //     canvas,
            //     this.getTesseractLang(sourceLanguage),
            //     {
            //         workerPath: '/tesseract/worker.min.js',
            //         corePath: '/tesseract/',
            //         workerBlobURL: false,
            //         gzip: false,
            //         langPath: '/tesseract/tessdata',
            //     }
            // );
            const { data } = await Tesseract.recognize(
                canvas,
                this.getTesseractLang(sourceLanguage),
                {
                    workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/worker.min.js',
                    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@6.0.0/tesseract-core.wasm.js',
                    langPath: 'https://cdn.jsdelivr.net/npm/@tesseract.js-data/' + this.getTesseractLang(sourceLanguage) + '/4.0.0_best/',
                }
            );

            return data.text;
        } catch (err) {
            console.error("OCR extraction failed:", err);
            return null;
        }
    }
}

export default new TesseractOCR();