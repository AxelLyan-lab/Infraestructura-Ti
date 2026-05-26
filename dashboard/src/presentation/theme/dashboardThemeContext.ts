import { createContext } from 'react'
import type { DashboardThemeId } from './dashboardThemeId'

export type DashboardThemeContextValue = {
  theme: DashboardThemeId
  setTheme: (next: DashboardThemeId) => void
  toggleTheme: () => void
}

export const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(null)
