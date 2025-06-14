import React, { useState } from 'react';
import './css/TextReader.css';
import WordTokenComponent from './WordTokenComponent';
import NonWordTokenComponent from './NonWordTokenComponent';
import SelectedWordsList from './SelectedWordsList';
import TranslationPopup from './TranslationPopup';

interface TextReaderProps {
    text: string;
}

interface WordToken {
    text: string;
    isWord: boolean;
}

const splitText = (text: string): WordToken[] => {
    const regex = /(\w+|[^\w\s])/g;
    const tokens: WordToken[] = [];
    const matches = text.matchAll(regex);

    let lastIndex = 0;
    for (const m of matches) {
        if (m.index === undefined) continue;
        if (m.index > lastIndex) {
            tokens.push({ text: text.slice(lastIndex, m.index), isWord: false });
        }
        tokens.push({ text: m[0], isWord: /\w+/.test(m[0]) });
        lastIndex = m.index + m[0].length;
    }

    if (lastIndex < text.length) {
        tokens.push({ text: text.slice(lastIndex), isWord: false });
    }

    return tokens;
};

const TextReader: React.FC<TextReaderProps> = ({ text }) => {
    const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
    const tokens = splitText(text);
    const [popupData, setPopupData] = useState<{
        word: string;
        translation: string;
        position: { x: number; y: number };
    } | null>(null);

    const fetchTranslation = async (word: string) => {
        try {
            const res = await fetch(`/api/translate/google?word=${encodeURIComponent(word)}`);
            const data = await res.json();
            return data.translation;
        } catch (err) {
            console.error('Error fetching translation', err);
            return "";
        }
    };


    const handleClick = (index: number) => {
        if (!tokens[index].isWord) return;

        const word = tokens[index].text.toLowerCase();
        if (!selectedWords.has(word)) {
            fetchTranslation(word).then((_value: string) => {
                const span = document.getElementById(`word-${index}`);
                if (!span) return;
                const rect = span.getBoundingClientRect();
                const position = {
                    x: rect.left + window.scrollX,
                    y: rect.bottom + window.scrollY,
                };
                try {
                    fetch(`/api/translate/google?word=${encodeURIComponent(word)}`).then(res => {
                        res.json().then(data => {
                            setPopupData({
                                word,
                                translation: data.translation,
                                position,
                            });
                        })
                    });


                } catch (err) {
                    console.error('Translation fetch failed', err);
                }
            });
        }

        setSelectedWords(prev => {
            const next = new Set(prev);
            if (next.has(word)) {
                next.delete(word);
            } else {
                next.add(word);
            }
            return next;
        });
    };

    return (
        <div className="text-reader ltr">
            {tokens.map((token, i) =>
                token.isWord ? (
                    <WordTokenComponent
                        key={i}
                        index={i}
                        text={token.text}
                        selected={selectedWords.has(tokens[i].text.toLowerCase())}
                        onClick={() => handleClick(i)}
                    />
                ) : (
                    <NonWordTokenComponent key={i} text={token.text} />
                )
            )}
            <br />
            <br />
            <SelectedWordsList words={selectedWords} />
            {popupData && (
                <TranslationPopup
                    translation={popupData.translation}
                    position={popupData.position}
                    onClose={() => setPopupData(null)}
                />
            )}
        </div>
    );
};

export default TextReader;