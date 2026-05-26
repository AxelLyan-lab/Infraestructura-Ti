import type { ReactNode } from 'react'
import { useThemeTokens } from '../theme/themeTokens'

export function DashboardShell({ children }: { children: ReactNode }) {
  const t = useThemeTokens()

  return (
    <div className={t.shell}>
      {t.theme === 'dark' ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(167,139,250,0.22),transparent_50%),radial-gradient(700px_circle_at_50%_120%,rgba(14,165,233,0.12),transparent_55%)]" />
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_circle_at_18%_-8%,rgba(59,130,246,0.2),transparent_58%),radial-gradient(900px_circle_at_92%_12%,rgba(139,92,246,0.16),transparent_52%),radial-gradient(760px_circle_at_50%_118%,rgba(14,165,233,0.1),transparent_55%)]" />
      )}
      <div className={['pointer-events-none absolute inset-0', t.shellVignette].join(' ')} />
      <div className={['pointer-events-none absolute inset-0', t.shellNoise].join(' ')} />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-16 pt-10 sm:px-8 sm:pt-14">
        {children}
      </div>
    </div>
  )
}
