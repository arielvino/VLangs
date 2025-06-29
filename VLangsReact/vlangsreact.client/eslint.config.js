import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended,
        //...tseslint.config.recommended,
        ...tseslint.configs.strictTypeChecked,//
        ...tseslint.configs.stylisticTypeChecked],//
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            project: ['./tsconfig.node.json', './tsconfig.app.json'],//
            tsconfigRootDir: import.meta.dirname,//
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
)
//export default tseslint.config({
//    extends: [
//        // Remove ...tseslint.configs.recommended and replace with this
//        ...tseslint.configs.recommendedTypeChecked,
//        // Alternatively, use this for stricter rules
//        ...tseslint.configs.strictTypeChecked,
//        // Optionally, add this for stylistic rules
//        ...tseslint.configs.stylisticTypeChecked,
//    ],
//    languageOptions: {
//        // other options...
//        parserOptions: {
//            project: ['./tsconfig.node.json', './tsconfig.app.json'],
//            tsconfigRootDir: import.meta.dirname,
//        },
//    },
//})
