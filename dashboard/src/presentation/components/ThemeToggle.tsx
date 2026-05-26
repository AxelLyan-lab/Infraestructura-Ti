import { useDashboardTheme } from '../theme/useDashboardTheme'

function IconMoon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3a8.5 8.5 0 1 0 11.5 11.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSun({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M3 12h2m14 0h2M4.22 19.78l1.42-1.42M17.36 5.64l1.42-1.42"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useDashboardTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}
      className={[
        'group relative flex h-11 w-11 items-center justify-center rounded-2xl',
        'border shadow-md backdrop-blur-xl transition-all duration-500 ease-out',
        'motion-safe:active:scale-[0.97]',
        theme === 'dark'
          ? 'border-white/15 bg-white/[0.07] text-white/85 hover:border-white/25 hover:bg-white/[0.11]'
          : 'border-white/80 bg-white/60 text-amber-600 hover:bg-white/80 hover:shadow-lg',
        theme === 'light' ? 'ring-1 ring-slate-900/[0.05]' : '',
      ].join(' ')}
    >
      <span
        className={[
          'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          theme === 'dark' ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_65%)]' : '',
        ].join(' ')}
      />
      {theme === 'dark' ? <IconSun className="relative h-5 w-5" /> : <IconMoon className="relative h-5 w-5" />}
    </button>
  )
}
