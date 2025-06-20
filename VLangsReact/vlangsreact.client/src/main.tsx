import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { CssBaseline, GlobalStyles } from '@mui/material'
import { ThemeWrapper } from './themes/ThemeManager.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeWrapper >
            <CssBaseline />
            <GlobalStyles styles={{
                'responsive': {
                    transform: 'scaling(1.3)'
                }
            }} />

            <App />
        </ThemeWrapper>
    </StrictMode>,
)
