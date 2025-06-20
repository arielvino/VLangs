import { Typography } from '@mui/material';
import React from 'react';

interface WordTokenProps {
    text: string;
    selected: boolean;
    onClick: () => void;
    index: number;
}

const WordTokenComponent: React.FC<WordTokenProps> = ({ index, text, selected, onClick }) => {
    return (
        //<span id={'word-' + index} className={selected ? 'highlight' : 'word'} onClick={onClick}>
        //    {text}
        //</span>
        <Typography
            id={`word-${index}`}
            onClick={onClick}
            component="span"
            paddingX={selected ? 0.8 : 0}
            paddingY={selected ? 0.3 : 0}
            borderRadius={selected?2:0}
            margin={0}
            sx={{ cursor: 'pointer', display: 'inline', color: selected?'white':'', bgcolor: selected ? 'error.main' : '', ":hover": selected ? '' : { bgcolor: 'primary.main', } }}
        >
            {text}
        </Typography>
    );
};

export default WordTokenComponent;
