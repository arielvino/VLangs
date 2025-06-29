import React, { useEffect, useState } from 'react';
import WordTokenComponent from './WordTokenComponent';
import NonWordTokenComponent from './NonWordTokenComponent';
import TranslationPopup from './TranslationPopup';
import { Box, Stack } from '@mui/material';
import IdbStorage from '../data/storage/idbStorage';
import type { StorageInterface } from '../data/storage/StorageInterface';
import { getDirection, type LanguageOption } from './LanguageSelector';

const storage: StorageInterface = IdbStorage;

interface TextReaderProps {
    text: string[];
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

const TextReader: React.FC<TextReaderProps> = ({ text, sourceLanguage, targetLanguage, tabId }) => {
    const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
    const tokenGroups: WordToken[][] = text.map(paragraph => splitText(paragraph));
    const [popupData, setPopupData] = useState<{
        word: string;
        translation: string;
        position: { x: number; y: number };
    } | null>(null);

    useEffect(() => {
        storage.getWordsByTab(tabId).then(words => setSelectedWords(new Set(words)));
    }, [])

    const fetchTranslation = async (word: string) => {
        try {
            const res = await fetch(`/api/translate/google?word=${encodeURIComponent(word)}&sourceLang=${encodeURIComponent(sourceLanguage)}&targetLang=${encodeURIComponent(targetLanguage)}`);
            const data = await res.json();
            return data.translation;
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
                next.delete(word);
                storage.deleteWordEntry(tabId, word);
            } else {
                next.add(word);
                storage.addWordEntry({
                    tabId: tabId,
                    known: false,
                    word: word,
                    timesAsked: 1
                })
            }
            return next;
        });

        if (!selectedWords.has(word)) {
            fetchTranslation(word).then((_value: string) => {
                const position = {
                    x,
                    y,
                };
                setPopupData({
                    word,
                    translation: _value,
                    position,
                });


            });
        }
    };

    return (
        <Stack spacing={2} maxWidth={600}>
            {
                tokenGroups.map((paragraph, pIndex) => (
                    <Box key={`p-${pIndex}`} sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        direction: getDirection(sourceLanguage as LanguageOption) === 'ltr' ? 'ltr' : 'rtl',
                        rowGap: 0,
                        columnGap: 0.4,
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

export default TextReader;