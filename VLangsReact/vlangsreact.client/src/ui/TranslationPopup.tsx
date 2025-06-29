import { Paper, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react';

interface Props {
    translation: string;
    position: { x: number; y: number };
    onClose: () => void;
    timeout?: number;
}

const TranslationPopup: React.FC<Props> = ({ translation, position, onClose, timeout = 3000 }) => {
    useEffect(() => {
        //const id = setTimeout(onClose, timeout);

        const handleClickOutside = () => onClose();
        window.addEventListener('click', handleClickOutside);

        return () => {
            //clearTimeout(id);
            window.removeEventListener('click', handleClickOutside);
        };
    }, [onClose, timeout]);

    const theme = useTheme();

    return (
        <Paper elevation={4}
            sx={{
                position: 'absolute',
                top: position.y + 8,
                left: position.x,
                backgroundColor: theme.palette.background.paper,
                border: '3px solid',
                borderColor: theme.palette.primary.main,
                paddingY: 1,
                paddingX: 2,
                borderRadius: 2,
                zIndex: 1000,
            }}
        >
            <Typography color={theme.palette.text.primary} variant={'h5'}>{translation}</Typography>
        </Paper>
    );
};

export default TranslationPopup;
