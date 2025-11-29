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
        // Landing screen
        app_title: 'VLangs',
        tagline: 'Learn Languages Through Reading',
        hero_description: 'Import PDFs, click words to translate, and track your vocabulary naturally.',
        get_started: 'Get Started',
        feature_read_title: 'Read Authentic Content',
        feature_read_desc: 'Import your own PDFs and documents to learn from materials you love.',
        feature_translate_title: 'Instant Translation',
        feature_translate_desc: 'Click any word for immediate translation and save it to your vocabulary.',
        feature_progress_title: 'Track Progress',
        feature_progress_desc: 'Monitor your vocabulary growth as you read and learn naturally.',
        // Tabs list
        create_new_tab: 'Create a New Tab',
        no_tabs_yet: 'No reading tabs yet',
        no_tabs_desc: 'Create your first tab to start learning',
        // Tab creation
        tab_name: 'Tab Name',
        choose_file: 'Choose File',
        source_language: 'Source Language',
        target_language: 'Target Language',
        ok: 'OK',
        cancel: 'Cancel',
        pages_count: 'pages',
        // Reading
        page: 'Page',
        previous_page: 'Previous',
        next_page: 'Next',
        // Words list
        tabs: 'Tabs',
        no_words_yet: 'No words yet',
        no_words_desc: 'Start reading to build your vocabulary',
        words_list: 'Vocabulary',
        word: 'word',
        words: 'words',
        learned: 'learned',
        table_word: 'Word',
        table_translation: 'Translation',
        table_times_asked: 'Times Asked',
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
        // Landing screen
        app_title: 'VLangs',
        tagline: 'למדו שפות דרך קריאה',
        hero_description: 'העלו קבצי PDF, לחצו על מילה לתרגום, ועקבו אחרי ההתקדמות שלכם.',
        get_started: 'בואו נתחיל',
        feature_read_title: 'קראו מה שמעניין אתכם',
        feature_read_desc: 'העלו קבצי PDF ומסמכים שאתם רוצים לקרוא וללמוד מהם.',
        feature_translate_title: 'תרגום בקליק',
        feature_translate_desc: 'לחצו על כל מילה כדי לתרגם אותה ולשמור אותה לעצמכם.',
        feature_progress_title: 'עקבו אחרי ההתקדמות',
        feature_progress_desc: 'ראו איך אוצר המילים שלכם גדל תוך כדי קריאה.',
        // Tabs list
        create_new_tab: 'כרטיסייה חדשה',
        no_tabs_yet: 'עדיין אין כאן כרטיסיות',
        no_tabs_desc: 'צרו כרטיסייה ראשונה והתחילו ללמוד',
        // Tab creation
        tab_name: 'שם הכרטיסיה',
        choose_file: 'בחרו קובץ',
        source_language: 'שפת המקור',
        target_language: 'שפת היעד',
        ok: 'אישור',
        cancel: 'ביטול',
        pages_count: 'עמודים',
        // Reading
        page: 'עמוד',
        previous_page: 'הקודם',
        next_page: 'הבא',
        // Words list
        tabs: 'כרטיסיות',
        no_words_yet: 'עדיין אין מילים',
        no_words_desc: 'התחילו לקרוא ותבנו את אוצר המילים שלכם',
        words_list: 'המילים שלי',
        word: 'מילה',
        words: 'מילים',
        learned: 'למדתם',
        table_word: 'מילה',
        table_translation: 'תרגום',
        table_times_asked: 'מספר פעמים',
        first_time_page_loaded_message: 'טעינה ראשונית עלולה לקחת מספר שניות.',
    }
}

export const useDictionary = () => strings[useLanguage().language];