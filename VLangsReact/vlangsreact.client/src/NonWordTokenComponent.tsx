import React from 'react';

interface NonWordTokenProps {
    text: string;
}

const NonWordTokenComponent: React.FC<NonWordTokenProps> = ({ text }) => {
    return <span>{text}</span>;
};

export default NonWordTokenComponent;
