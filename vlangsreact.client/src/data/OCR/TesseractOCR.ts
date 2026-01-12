import type InterfaceOCR from './InterfaceOCR';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import Tesseract from 'tesseract.js';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfjsWorker;


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
                    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5/tesseract-core.wasm.js',
                    langPath: 'https://cdn.jsdelivr.net/npm/@tesseract.js-data/' + this.getTesseractLang(sourceLanguage) + '@1.0.0/4.0.0_best_int/',
                    gzip: true,
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