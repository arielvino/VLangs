import { createContext, useContext, useState, useMemo } from 'react';

const LANGUAGE_STORAGE_KEY = 'site-language';
const DEFAULT_LANGUAGE = 'en';

export type Language = 'en' | 'he'; // extend as needed

const LanguageContext = createContext<{
    language: Language;
    toggleLanguage: () => void;
}>({
    language: DEFAULT_LANGUAGE,
    toggleLanguage: () => { },
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        return (localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language) || DEFAULT_LANGUAGE;
    });

    const toggleLanguage = () => {
        setLanguage((prev) => {
            const next = prev === 'en' ? 'he' : 'en';
            localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
            return next;
        });
    };

    const value = useMemo(() => ({ language, toggleLanguage }), [language]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};