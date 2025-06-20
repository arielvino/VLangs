import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export interface LanguageOption {
    code: string;
    label: string;
}

interface LanguageSelectProps {
    label: string;
    value: LanguageOption;
    onChange: (lang: LanguageOption ) => void;
}

export const languages: LanguageOption[] = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'German' },
    { code: 'fr', label: 'French' },
    { code: 'es', label: 'Spanish' },
    { code: 'zh', label: 'Chinese' },
    { code: 'ar', label: 'Arabic' },
    { code: 'ru', label: 'Russian' },
    { code: 'ja', label: 'Japanese' },
];

const LanguageSelect: React.FC<LanguageSelectProps> = ({ label, value, onChange }) => {
    return (
        <Autocomplete
            disablePortal
            options={languages}
            value={value}
            onChange={(event, newValue) => onChange(newValue!)}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    );
};

export default LanguageSelect;
