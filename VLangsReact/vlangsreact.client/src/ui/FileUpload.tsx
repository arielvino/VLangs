import { Button } from '@mui/material';
import React, { useRef } from 'react';
import { useDictionary } from './localization/Strings'

type Props = {
    onFileSelect: (file: File) => void;
};

const FileUpload: React.FC<Props> = ({ onFileSelect }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => inputRef.current?.click();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    };

    return (
        <>
            <input
                type="file"
                ref={inputRef}
                hidden
                onChange={handleChange}
            />
            <Button variant="outlined" size='small' fullWidth onClick={handleClick}>
                {useDictionary().choose_file}
            </Button>
        </>
    );
};

export default FileUpload;
