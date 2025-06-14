import React from 'react';
import './css/SelectedWordsList.css';

interface SelectedWordsListProps {
    words: Set<string>;
}

const SelectedWordsList: React.FC<SelectedWordsListProps> = ({ words }) => {
    if (words.size === 0) return null;

    return (
        <div className="selected-word-list">
            <h4>Selected Words</h4>
            <ul>
                {[...words].map((word, i) => (
                    <li key={i}>{word}</li>
                ))}
            </ul>
        </div>
    );
};

export default SelectedWordsList;
