import React, { useEffect } from 'react';

interface Props {
    translation: string;
    position: { x: number; y: number };
    onClose: () => void;
    timeout?: number;
}

const TranslationPopup: React.FC<Props> = ({ translation, position, onClose, timeout = 3000 }) => {
    useEffect(() => {
        const id = setTimeout(onClose, timeout);

        const handleClickOutside = () => onClose();
        window.addEventListener('click', handleClickOutside);

        return () => {
            clearTimeout(id);
            window.removeEventListener('click', handleClickOutside);
        };
    }, [onClose, timeout]);

    return (
        <div
            style={{
                position: 'absolute',
                top: position.y + 8,
                left: position.x,
                backgroundColor: '#444444',
                border: '1px solid #ccc',
                padding: '6px 10px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 1000,
                maxWidth: '200px',
                color: 'white',
            }}
        >
            {translation}
        </div>
    );
};

export default TranslationPopup;
