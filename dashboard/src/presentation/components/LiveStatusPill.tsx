import { useThemeTokens } from '../theme/themeTokens'

type LiveStatusProps = {
  isLive: boolean
  lastSyncedAt: Date | null
}

function formatClock(d: Date) {
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function IconCog({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LiveStatusPill({ isLive, lastSyncedAt }: LiveStatusProps) {
  const t = useThemeTokens()

  return (
    <div className={t.livePill}>
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={[
            'absolute inline-flex h-full w-full rounded-full opacity-75',
            isLive ? 'animate-ping bg-emerald-400/70' : t.theme === 'dark' ? 'bg-white/10' : 'bg-slate-400/35',
          ].join(' ')}
        />
        <span
          className={[
            'relative inline-flex h-2.5 w-2.5 rounded-full',
            isLive ? 'bg-emerald-400' : 'bg-rose-500',
          ].join(' ')}
        />
      </span>
      <span className="flex items-center gap-2">
        {isLive ? (
          <span
            className="inline-flex shrink-0"
            title="Conexión en vivo"
            aria-label="Conexión en vivo con el sensor"
          >
            <IconCog
              className={[
                'h-3.5 w-3.5 motion-safe:animate-[spin_2.8s_linear_infinite]',
                t.theme === 'dark' ? 'text-emerald-200/90' : 'text-emerald-700',
              ].join(' ')}
              aria-hidden
            />
          </span>
        ) : null}
        <span className={['font-medium tracking-wide', t.textSecondary].join(' ')}>
          {isLive ? 'En vivo' : 'Sin datos'}
        </span>
      </span>
      {lastSyncedAt ? (
        <span className={t.theme === 'dark' ? 'text-white/45' : 'text-slate-500'}>
          Última lectura UI · {formatClock(lastSyncedAt)}
        </span>
      ) : null}
    </div>
  )
}
