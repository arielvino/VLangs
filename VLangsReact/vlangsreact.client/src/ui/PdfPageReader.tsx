import React, { useState, useEffect } from 'react';
import TextReader from './TextReader';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';


//GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.31/pdf.worker.min.mjs';
GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfPageReaderProps {
    pageNumber: number;
    content: ArrayBuffer;
    tabId: string;
    sourceLang: string;
    targetLang: string;
}

const PdfPageReader: React.FC<PdfPageReaderProps> = ({ tabId, pageNumber, content, sourceLang, targetLang }) => {
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

    // Load PDF once
    useEffect(() => {
        console.log('effect try to load pdf document')
        getDocument(
            { data: content }
        ).promise
            .then((doc) => { setPdfDoc(doc); console.log('success') })
            .catch(console.error);
    }, [content]);

    // Load page text when pageNumber changes
    useEffect(() => {
        if (!pdfDoc) return;

        const loadText = async () => {
            if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
                setParagraphs([`Page out of bounds (1–${pdfDoc.numPages})`]);
                return;
            }

            const page = await pdfDoc.getPage(pageNumber);
            const content = await page.getTextContent();

            const linesMap = new Map<number, string[]>();

            // Step 1: Collect lines by Y position
            for (const item of content.items as any[]) {
                const y = Math.round(item.transform[5]); // vertical position
                if (!linesMap.has(y)) linesMap.set(y, []);
                linesMap.get(y)!.push(item.str);
            }

            // Step 2: Sort lines top-to-bottom
            const sortedLines = Array.from(linesMap.entries())
                .sort((a, b) => b[0] - a[0]); // PDF y=0 is bottom, so higher y is lower

            // Step 3: Compute average line spacing
            let totalGap = 0;
            for (let i = 1; i < sortedLines.length; i++) {
                totalGap += sortedLines[i - 1][0] - sortedLines[i][0];
            }
            const averageGap = totalGap / (sortedLines.length - 1);

            // Step 4: Detect paragraphs by gap threshold
            const paragraphs: string[] = [];
            let currentParagraph: string[] = [];

            for (let i = 0; i < sortedLines.length; i++) {
                const [, words] = sortedLines[i];
                const lineText = words.join(' ');

                if (i > 0) {
                    const prevY = sortedLines[i - 1][0];
                    const currY = sortedLines[i][0];
                    const gap = prevY - currY;

                    if (gap > averageGap * 1) {
                        // Start new paragraph
                        paragraphs.push(currentParagraph.join(' '));
                        currentParagraph = [];
                    }
                }

                currentParagraph.push(lineText);
            }
            if (currentParagraph.length) setParagraphs([...paragraphs, currentParagraph.join(' ')]);


        };

        loadText();
    }, [pdfDoc, pageNumber]);

    return <TextReader sourceLanguage={sourceLang} targetLanguage={targetLang} text={paragraphs} tabId={tabId} />;
};

export default PdfPageReader;