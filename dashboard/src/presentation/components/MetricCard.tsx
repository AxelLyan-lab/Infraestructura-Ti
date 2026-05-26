import { GlassPanel } from './GlassPanel'
import { useThemeTokens } from '../theme/themeTokens'

type MetricCardProps = {
  title: string
  value: string
  subtitle?: string
  accent: 'sky' | 'violet'
}

const accentRing: Record<MetricCardProps['accent'], string> = {
  sky: 'from-sky-400/35 via-cyan-300/10 to-transparent',
  violet: 'from-violet-400/35 via-fuchsia-300/10 to-transparent',
}

export function MetricCard({ title, value, subtitle, accent }: MetricCardProps) {
  const t = useThemeTokens()

  return (
    <GlassPanel className="p-6 sm:p-8">
      <div
        className={[
          'pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br opacity-70 blur-2xl',
          accentRing[accent],
        ].join(' ')}
      />
      <p className={['text-xs font-medium uppercase tracking-[0.22em]', t.textEyebrow].join(' ')}>{title}</p>
      <p
        className={[
          'mt-4 font-[system-ui] text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl',
          t.textPrimary,
        ].join(' ')}
      >
        {value}
      </p>
      {subtitle ? <p className={['mt-2 text-sm', t.textMuted].join(' ')}>{subtitle}</p> : null}
    </GlassPanel>
  )
}
