//import React, { useState, useEffect } from 'react';
//import TextReader from './TextReader';
//import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist'
//import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';


////GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.31/pdf.worker.min.mjs';
//GlobalWorkerOptions.workerSrc = pdfjsWorker;

//interface PdfPageReaderProps {
//    pageNumber: number;
//    content: ArrayBuffer;
//    tabId: string;
//    sourceLang: string;
//    targetLang: string;
//}

//const PdfPageReader: React.FC<PdfPageReaderProps> = ({ tabId, pageNumber, content, sourceLang, targetLang }) => {
//    const [paragraphs, setParagraphs] = useState<string[]>([]);
//    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

//    // Load PDF once
//    useEffect(() => {
//        console.log('effect try to load pdf document')
//        getDocument(
//            { data: content }
//        ).promise
//            .then((doc) => { setPdfDoc(doc); console.log('success') })
//            .catch(console.error);
//    }, [content]);

//    // Load page text when pageNumber changes
//    useEffect(() => {
//        if (!pdfDoc) return;

//        const loadText = async () => {
//            if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
//                setParagraphs([`Page out of bounds (1–${pdfDoc.numPages})`]);
//                return;
//            }

//            const page = await pdfDoc.getPage(pageNumber);
//            const content = await page.getTextContent();

//            const linesMap = new Map<number, string[]>();

//            // Step 1: Collect lines by Y position
//            for (const item of content.items as any[]) {
//                const y = Math.round(item.transform[5]); // vertical position
//                if (!linesMap.has(y)) linesMap.set(y, []);
//                linesMap.get(y)!.push(item.str);
//            }

//            // Step 2: Sort lines top-to-bottom
//            const sortedLines = Array.from(linesMap.entries())
//                .sort((a, b) => b[0] - a[0]); // PDF y=0 is bottom, so higher y is lower

//            // Step 3: Compute average line spacing
//            let totalGap = 0;
//            for (let i = 1; i < sortedLines.length; i++) {
//                totalGap += sortedLines[i - 1][0] - sortedLines[i][0];
//            }
//            const averageGap = totalGap / (sortedLines.length - 1);

//            // Step 4: Detect paragraphs by gap threshold
//            const paragraphs: string[] = [];
//            let currentParagraph: string[] = [];

//            for (let i = 0; i < sortedLines.length; i++) {
//                const [, words] = sortedLines[i];
//                const lineText = words.join(' ');

//                if (i > 0) {
//                    const prevY = sortedLines[i - 1][0];
//                    const currY = sortedLines[i][0];
//                    const gap = prevY - currY;

//                    if (gap > averageGap * 1) {
//                        // Start new paragraph
//                        paragraphs.push(currentParagraph.join(' '));
//                        currentParagraph = [];
//                    }
//                }

//                currentParagraph.push(lineText);
//            }
//            if (currentParagraph.length) setParagraphs([...paragraphs, currentParagraph.join(' ')]);


//        };

//        loadText();
//    }, [pdfDoc, pageNumber]);

//    return <TextReader sourceLanguage={sourceLang} targetLanguage={targetLang} text={paragraphs} tabId={tabId} />;
//};

//export default PdfPageReader;

import React, { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import Tesseract from 'tesseract.js';
import { getDirection, type LanguageOption } from "../tab_creation/LanguageSelector";
import { Box, CircularProgress } from "@mui/material";
import TextReader from "./TextReader";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

function getTesseractLang(code: string): string {
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

interface PdfPageReaderProps {
    pageNumber: number;
    content: ArrayBuffer;
    tabId: string;
    sourceLang: string;
    targetLang: string;
}

const PdfPageReaderWithOCR: React.FC<PdfPageReaderProps> = ({
    pageNumber,
    content,
    tabId,
    sourceLang,
    targetLang,
}) => {
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);

    useEffect(() => {
        getDocument({ data: content }).promise.then(setPdf);
    }, [content]);
    useEffect(() => {
        const extract = async () => {
            if (!pdf) return;

            setLoading(true);
            const page = await pdf!.getPage(pageNumber);

            // render page to canvas
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d")!;
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, canvas, viewport }).promise;

            // run OCR
            const { data } = await Tesseract.recognize(
                canvas,
                getTesseractLang(sourceLang) || "eng",
                { logger: m => console.log(m) }
            );

            const text = data.text;
            const paras = text
                .split(/\n\s*\n/) // split on empty line
                .map(p => p.trim())
                .filter(Boolean);

            setParagraphs(paras);
            setLoading(false);
        };

        extract();
    }, [content, pageNumber, sourceLang]);

    if (loading) return <CircularProgress color="secondary" />;

    return (
        <Box dir={getDirection(sourceLang as LanguageOption) === 'ltr' ? 'ltr' : 'rtl'}>
            <TextReader sourceLanguage={sourceLang} targetLanguage={targetLang} text={paragraphs} tabId={tabId} />
        </Box>
    );
};

export default PdfPageReaderWithOCR;