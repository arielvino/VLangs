import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './ui/App.tsx'
import { CssBaseline } from '@mui/material'
import { ThemeWrapper } from './ui/themes/ThemeManager.tsx'
import { LanguageProvider } from './ui/localization/LanguageManager.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LanguageProvider>
            <ThemeWrapper >
                <CssBaseline />
                <App />
            </ThemeWrapper>
        </LanguageProvider>
    </StrictMode>,
)
