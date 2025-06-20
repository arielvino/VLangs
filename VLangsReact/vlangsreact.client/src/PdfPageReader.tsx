import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.31/pdf.min.mjs';
import TextReader from './TextReader';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.31/pdf.worker.min.mjs';

interface PdfPageReaderProps {
    pageNumber: number;
    content: ArrayBuffer;
}

const PdfPageReader: React.FC<PdfPageReaderProps> = ({ pageNumber, content }) => {
    const [text, setText] = useState('');
    const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

    // Load PDF once
    useEffect(() => {
        pdfjsLib.getDocument(
            { data: content }
        ).promise
            .then(setPdfDoc)
            .catch(console.error);
    }, [content]);

    // Load page text when pageNumber changes
    useEffect(() => {
        if (!pdfDoc) return;

        const loadText = async () => {
            if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
                setText(`Page out of bounds (1–${pdfDoc.numPages})`);
                return;
            }

            const page = await pdfDoc.getPage(pageNumber);
            const content = await page.getTextContent();
            const linesMap = new Map<number, string[]>();

            for (const item of content.items as any[]) {
                const y = Math.round(item.transform[5]);
                if (!linesMap.has(y)) linesMap.set(y, []);
                linesMap.get(y)!.push(item.str);
            }

            const lines = Array.from(linesMap.entries())
                .sort((a, b) => b[0] - a[0])
                .map(([, words]) => words.join(' '));

            setText(lines.join('\n') || '[No text]');
        };

        loadText();
    }, [pdfDoc, pageNumber]);

    return <TextReader text={text} />;
};

export default PdfPageReader;