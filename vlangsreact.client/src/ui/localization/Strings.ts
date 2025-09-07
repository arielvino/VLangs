import { useLanguage } from "./LanguageManager";

type Direction = 'ltr' | 'rtl';

const strings = {
    en: {
        languages: {
            en: 'English',
            de: 'German',
            fr: 'French',
            es: 'Spanish',
            zh: 'Chinese',
            ar: 'Arabic',
            ru: 'Russian',
            ja: 'Japanese',
            he: 'Hebrew',
        },
        direction: 'ltr' as Direction,
        create_new_tab: 'Create a New Tab',
        tab_name: 'Tab Name',
        choose_file: 'Choose File',
        source_language: 'Source Language',
        target_language: 'Target Language',
        ok: 'OK',
        cancel: 'Cancel',
        page: 'Page',
        previous_page: 'Previous Page',
        next_page: 'Next Page',
        tabs: 'Tabs',
        no_words_yet: 'There are no words yet',
        words_list: 'New learned Words',
        first_time_page_loaded_message: 'If this page is loaded for the first time - it may take a few seconds.',
    },
    he: {
        languages: {
            en: 'אנגלית',
            de: 'גרמנית',
            fr: 'צרפתית',
            es: 'ספרדית',
            zh: 'סינית',
            ar: 'ערבית',
            ru: 'רוסית',
            ja: 'יפנית',
            he: 'עברית',
        },
        direction: 'rtl' as Direction,
        create_new_tab: 'יצירת כרטיסיה חדשה',
        tab_name: 'שם הכרטיסיה',
        choose_file: 'בחר קובץ',
        source_language: 'שפת המקור',
        target_language: 'שפת היעד',
        ok: 'אישור',
        cancel: 'ביטול',
        page: 'עמוד',
        previous_page: 'לעמוד הקודם',
        next_page: 'לעמוד הבא',
        tabs: 'כרטיסיות',
        no_words_yet: 'עדיין אין פה כלום',
        words_list: 'מילים חדשות שנלמדו',
        first_time_page_loaded_message: 'אם העמוד הזה נטען בפעם הראשונה - זה עלול לקחת כמה שניות.',
    }
}

export const useDictionary = () => strings[useLanguage().language];