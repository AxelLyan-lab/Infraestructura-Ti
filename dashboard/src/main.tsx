import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DashboardThemeProvider } from './presentation/theme/DashboardThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DashboardThemeProvider>
      <App />
    </DashboardThemeProvider>
  </StrictMode>,
)
