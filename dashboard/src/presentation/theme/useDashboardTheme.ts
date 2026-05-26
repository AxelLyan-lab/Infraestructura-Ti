import { useContext } from 'react'
import { DashboardThemeContext } from './dashboardThemeContext'

export function useDashboardTheme() {
  const ctx = useContext(DashboardThemeContext)
  if (!ctx) {
    throw new Error('useDashboardTheme debe usarse dentro de DashboardThemeProvider')
  }
  return ctx
}
