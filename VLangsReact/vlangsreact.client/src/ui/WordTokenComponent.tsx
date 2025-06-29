import { Typography } from '@mui/material';
import React from 'react';

interface WordTokenProps {
    text: string;
    selected: boolean;
    onClick: (x: number, y: number, word: string) => void;
}

const WordTokenComponent: React.FC<WordTokenProps> = ({ text, selected, onClick }) => {
    return (
        <Typography
            onClick={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                const x = rect.left + window.scrollX;
                const y = rect.bottom + window.scrollY;
                onClick(x, y, text);
            }}
            component="span"
            borderRadius={0.4}
            paddingX={0.5}
            margin={0}
            sx={{
                cursor: 'pointer',
                display: 'inline',
                color: selected ? 'white' : '',
                bgcolor: selected ? 'error.main' : '',
                ":hover": selected ? '' : { bgcolor: 'primary.main', color: 'white' }
            }}
        >
            {text}
        </Typography>
    );
};

export default WordTokenComponent;
