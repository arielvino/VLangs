import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useDictionary } from './localization/Strings';

export const LANGUAGE_OPTIONS = [
    { code: 'en', direction: 'ltr' },
    { code: 'de', direction: 'ltr' },
    { code: 'fr', direction: 'ltr' },
    { code: 'es', direction: 'ltr' },
    { code: 'ar', direction: 'rtl' },
    { code: 'ru', direction: 'ltr' },
    { code: 'he', direction: 'rtl' },
] as const;

export type LanguageOption = typeof LANGUAGE_OPTIONS[number]['code'];
export type LanguageDirection = 'ltr' | 'rtl';
const languageCodes = LANGUAGE_OPTIONS.map(l => l.code);

export const getDirection = (code: LanguageOption): LanguageDirection => {
    const entry = LANGUAGE_OPTIONS.find(l => l.code === code);
    if (!entry) throw new Error(`Unsupported language code: ${code}`);
    return entry.direction;
};

interface LanguageSelectProps {
    label: string;
    value: LanguageOption;
    onChange: (lang: LanguageOption ) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ label, value, onChange }) => {
    const dict = useDictionary();

    return (
        <Autocomplete
            disablePortal
            options={languageCodes}
            value={value}
            onChange={(_event, newValue) => onChange(newValue!)}
            getOptionLabel={(option) => dict.languages[option]}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    );
};

export default LanguageSelect;