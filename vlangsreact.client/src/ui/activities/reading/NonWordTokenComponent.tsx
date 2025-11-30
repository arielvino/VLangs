import { Typography } from '@mui/material';
import React from 'react';

interface NonWordTokenProps {
    text: string;
}

const NonWordTokenComponent: React.FC<NonWordTokenProps> = ({ text }) => {
    return (
        <Typography
            component="span"
            sx={{
                display: 'inline',
                padding: 0,
                margin: 0
            }}
        >
            {text}
        </Typography>
    );
};

export default NonWordTokenComponent;
