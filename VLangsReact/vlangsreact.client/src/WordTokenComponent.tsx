import React from 'react';

interface WordTokenProps {
    text: string;
    selected: boolean;
    onClick: () => void;
    index: number;
}

const WordTokenComponent: React.FC<WordTokenProps> = ({ index, text, selected, onClick }) => {
    return (
        <span id={'word-' + index} className={selected ? 'highlight' : ''} onClick={onClick}>
            {text}
        </span>
    );
};

export default WordTokenComponent;
