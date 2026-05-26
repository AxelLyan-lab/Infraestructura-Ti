import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DashboardThemeId } from './dashboardThemeId'
import { DashboardThemeContext } from './dashboardThemeContext'

const STORAGE_KEY = 'iot-dashboard-theme'

function readInitialTheme(): DashboardThemeId {
  if (typeof window === 'undefined') return 'dark'
  const raw = window.localStorage.getItem(STORAGE_KEY)
  return raw === 'light' ? 'light' : 'dark'
}

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<DashboardThemeId>(readInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.dashboardTheme = theme
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  )

  return <DashboardThemeContext.Provider value={value}>{children}</DashboardThemeContext.Provider>
}
