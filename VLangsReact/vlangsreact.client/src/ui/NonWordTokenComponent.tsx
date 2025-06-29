import { Typography } from '@mui/material';
import React from 'react';

interface NonWordTokenProps {
    text: string;
}

const NonWordTokenComponent: React.FC<NonWordTokenProps> = ({ text }) => {
    return <Typography paddingX={0}>{text}</Typography>;
};

export default NonWordTokenComponent;
