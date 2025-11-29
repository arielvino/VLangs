import React, { useEffect, useState } from 'react';
import WordTokenComponent from './WordTokenComponent';
import NonWordTokenComponent from './NonWordTokenComponent';
import TranslationPopup from './TranslationPopup';
import { Box, Stack } from '@mui/material';
import IdbStorage from '../../../data/storage/idbStorage';
import type { StorageInterface } from '../../../data/storage/StorageInterface';
import { getDirection, type LanguageOption } from '../tab_creation/LanguageSelector';

const storage: StorageInterface = IdbStorage;

interface TextReaderProps1 {
    paragraphs: string[];
    sourceLanguage: string;
    targetLanguage: string;
    tabId: string;
}

interface WordToken {
    text: string;
    isWord: boolean;
}

const splitText = (text: string): WordToken[] => {
    const regex = /(\p{L}+\p{M}*|[^\p{L}\p{M}\s])/gu
    const tokens: WordToken[] = [];
    const matches = text.matchAll(regex);

    let lastIndex = 0;
    for (const m of matches) {
        if (m.index === undefined) continue;
        if (m.index > lastIndex) {
            tokens.push({ text: text.slice(lastIndex, m.index), isWord: false });
        }
        tokens.push({
            text: m[0], isWord: /^\p{L}[\p{L}\p{M}]*$/u.test(m[0])
        });
        lastIndex = m.index + m[0].length;
    }

    if (lastIndex < text.length) {
        tokens.push({ text: text.slice(lastIndex), isWord: false });
    }

    return tokens;
};

const TextReader1: React.FC<TextReaderProps1> = ({ paragraphs, sourceLanguage, targetLanguage, tabId }) => {
    const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
    const tokenGroups: WordToken[][] = paragraphs.map(paragraph => splitText(paragraph));
    const [popupData, setPopupData] = useState<{
        word: string;
        translation: string;
        position: { x: number; y: number };
    } | null>(null);

    useEffect(() => {
        storage.getWordsByTab(tabId).then(words => setSelectedWords(new Set(words)));
    }, [])

    const fetchTranslation = async (word: string, translator: string = "google") => {
        try {
            const res = await fetch(`/api/translate?engine=${translator}&word=${encodeURIComponent(word)}&sourceLang=${encodeURIComponent(sourceLanguage)}&targetLang=${encodeURIComponent(targetLanguage)}`);
            const data = await res.json();
            return data.translation as string;
        } catch (err) {
            console.error('Error fetching translation', err);
            return "";
        }
    };

    const handleClick = (x: number, y: number, word: string) => {
        word = word.toLowerCase();

        setSelectedWords(prev => {
            const next = new Set(prev);
            if (next.has(word)) {
                //next.delete(word);
                //storage.deleteWordEntry(tabId, word);
            } else {
                next.add(word);
                storage.addWordEntry({
                    tabId: tabId,
                    known: false,
                    word: word,
                    translation: { type: "text", content: "" },
                    addedAt: new Date(),
                    timesAsked: 1,
                })
            }
            return next;
        });
        if (!selectedWords.has(word)) {
            fetchTranslation(word).then((_value: string,) => {
                const position = {
                    x,
                    y,
                };
                setPopupData({
                    word,
                    translation: _value,
                    position,
                });

                storage.updateWordEntry(tabId, word, { translation: { type: "text", content: _value } })
            });
        }
        else {
            storage.getWordForTab(tabId, word).then(entry => {
                if (entry?.translation) {
                    const position = {
                        x,
                        y,
                    };
                    const translationText = entry.translation.type === "text" ? entry.translation.content : "";
                    setPopupData({
                        word,
                        translation: translationText,
                        position,
                    });
                    storage.updateWordEntry(tabId, word, { timesAsked: (entry.timesAsked || 0) + 1 })
                }
            })
        }
    }

    return (
        <Stack spacing={2}>
            {
                tokenGroups.map((paragraph, pIndex) => (
                    <Box key={`p-${pIndex}`} sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        direction: getDirection(sourceLanguage as LanguageOption) === 'ltr' ? 'ltr' : 'rtl',
                        rowGap: 0,
                        columnGap: 0.1,
                    }}>
                        {paragraph.map((token, i) => (

                            token.isWord ?
                                <WordTokenComponent
                                    key={`w-${pIndex}-${i}`}
                                    text={token.text}
                                    selected={selectedWords.has(token.text.toLowerCase())}
                                    onClick={handleClick}
                                />
                                :
                                <NonWordTokenComponent key={`nw-${pIndex}-${i}`} text={token.text} />

                        ))}
                        <Box flexGrow={1} />
                    </Box>
                ))}

            {
                popupData && (
                    <TranslationPopup
                        translation={popupData.translation}
                        position={popupData.position}
                        onClose={() => setPopupData(null)}
                    />
                )
            }
        </Stack >
    );
};

//interface TextReaderProps {
//    text: string;
//    unknownwords: Set<string>;
//    onWordClick?: (
//        word: string,
//        x: number,
//        y: number,
//        callback: (component: JSX.Element) => void
//    ) => void;
//}

//const TextReader: React.FC<TextReaderProps> = ({ text, unknownwords, onWordClick }) => {
//    const tokenGroups: WordToken[][] = paragraphs.map(paragraph => splitText(paragraph));
//    const [popupData, setPopupData] = useState<{
//        word: string;
//        translation: string;
//        position: { x: number; y: number };
//    } | null>(null);

//    useEffect(() => {
//        storage.getWordsByTab(tabId).then(words => setSelectedWords(new Set(words)));
//    }, [])

//    const fetchTranslation = async (word: string, translator: string = "google") => {
//        try {
//            const res = await fetch(`/api/translate?engine=${translator}&word=${encodeURIComponent(word)}&sourceLang=${encodeURIComponent(sourceLanguage)}&targetLang=${encodeURIComponent(targetLanguage)}`);
//            const data = await res.json();
//            return data.translation as string;
//        } catch (err) {
//            console.error('Error fetching translation', err);
//            return "";
//        }
//    };

//    const handleClick = (x: number, y: number, word: string) => {
//        word = word.toLowerCase();

//        setSelectedWords(prev => {
//            const next = new Set(prev);
//            if (next.has(word)) {
//                //next.delete(word);
//                //storage.deleteWordEntry(tabId, word);
//            } else {
//                next.add(word);
//                storage.addWordEntry({
//                    tabId: tabId,
//                    known: false,
//                    word: word,
//                    timesAsked: 1,
//                })
//            }
//            return next;
//        });
//        if (!selectedWords.has(word)) {
//            fetchTranslation(word).then((_value: string,) => {
//                const position = {
//                    x,
//                    y,
//                };
//                setPopupData({
//                    word,
//                    translation: _value,
//                    position,
//                });

//                storage.updateWordEntry(tabId, word, { translation: { type: "text", content: _value } })
//            });
//        }
//        else {
//            storage.getWordForTab(tabId, word).then(entry => {
//                if (entry?.translation) {
//                    const position = {
//                        x,
//                        y,
//                    };
//                    setPopupData({
//                        word,
//                        translation: entry.translation,
//                        position,
//                    });
//                    storage.updateWordEntry(tabId, word, { timesAsked: entry!.timesAsked + 1 })
//                }
//            })
//        }
//    }

//    return (
//        <Stack spacing={2}>
//            {
//                tokenGroups.map((paragraph, pIndex) => (
//                    <Box key={`p-${pIndex}`} sx={{
//                        display: 'flex',
//                        justifyContent: 'space-between',
//                        flexWrap: 'wrap',
//                        direction: getDirection(sourceLanguage as LanguageOption) === 'ltr' ? 'ltr' : 'rtl',
//                        rowGap: 0,
//                        columnGap: 0.1,
//                    }}>
//                        {paragraph.map((token, i) => (

//                            token.isWord ?
//                                <WordTokenComponent
//                                    key={`w-${pIndex}-${i}`}
//                                    text={token.text}
//                                    selected={selectedWords.has(token.text.toLowerCase())}
//                                    onClick={handleClick}
//                                />
//                                :
//                                <NonWordTokenComponent key={`nw-${pIndex}-${i}`} text={token.text} />

//                        ))}
//                        <Box flexGrow={1} />
//                    </Box>
//                ))}

//            {
//                popupData && (
//                    <TranslationPopup
//                        translation={popupData.translation}
//                        position={popupData.position}
//                        onClose={() => setPopupData(null)}
//                    />
//                )
//            }
//        </Stack >
//    );
//};

export default TextReader1;