import type { AlertaRow, AlertaTipo } from '../../types/alertas'
import { historialAccent, severityForTipo } from '../utils/alertPresentation'
import { useThemeTokens } from '../theme/themeTokens'
import { GlassPanel } from './GlassPanel'

function formatAlertTimestamp(iso: string) {
  return new Date(iso).toLocaleString('es', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function sortDesc(rows: AlertaRow[]) {
  return [...rows].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
}

function Column({
  tipo,
  title,
  subtitle,
  rows,
  isLight,
  t,
}: {
  tipo: AlertaTipo
  title: string
  subtitle: string
  rows: AlertaRow[]
  isLight: boolean
  t: ReturnType<typeof useThemeTokens>
}) {
  const sev = severityForTipo(tipo, isLight)
  const accent = historialAccent(tipo)

  return (
    <div
      className={[
        'relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border p-3 pl-4 backdrop-blur-xl sm:min-h-[260px]',
        sev.border,
        isLight ? 'bg-white/45 shadow-sm' : 'bg-white/[0.04]',
      ].join(' ')}
    >
      <div
        className={['pointer-events-none absolute bottom-4 left-2 top-4 w-1 rounded-full', accent.bar].join(' ')}
        aria-hidden
      />
      <div className="relative border-b border-white/10 pb-2 pl-1 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={['text-sm font-semibold tracking-tight', t.textPrimary].join(' ')}>{title}</h3>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${sev.chip}`}>{sev.label}</span>
        </div>
        <p className={['mt-1 text-[11px] leading-snug', t.textMuted].join(' ')}>{subtitle}</p>
      </div>
      <div className="alerts-scroll relative mt-2 max-h-[min(40vh,360px)] flex-1 space-y-2 overflow-y-auto pl-1 pr-1">
        {rows.length === 0 ? (
          <p className={['py-6 text-center text-xs', t.textMuted].join(' ')}>Sin registros</p>
        ) : (
          rows.map((a) => (
            <div
              key={a.id}
              className={[
                'rounded-xl border border-l-[3px] px-2.5 py-2 text-xs transition-colors',
                accent.row,
              ].join(' ')}
            >
              <p className={['font-medium', t.textPrimary].join(' ')}>{a.mensaje}</p>
              <p className={['mt-1 tabular-nums', t.textSecondary].join(' ')}>
                {a.tipo_alerta.startsWith('temperatura') ? `${a.valor.toFixed(1)} °C` : `${a.valor.toFixed(1)} %`}
              </p>
              <p className={['mt-1 text-[10px]', t.textEyebrow].join(' ')}>{formatAlertTimestamp(a.fecha)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const COLS: Array<{ tipo: AlertaTipo; title: string; subtitle: string }> = [
  { tipo: 'temperatura_advertencia', title: 'Temperatura · advertencia', subtitle: 'Lecturas > 30 °C' },
  { tipo: 'temperatura_critica', title: 'Temperatura · crítica', subtitle: 'Lecturas > 45 °C' },
  { tipo: 'humedad_advertencia', title: 'Humedad · advertencia', subtitle: 'Lecturas > 60 %' },
  { tipo: 'humedad_critica', title: 'Humedad · crítica', subtitle: 'Lecturas > 80 %' },
]

type Props = {
  alertas: AlertaRow[]
}

export function AlertasHistorialSection({ alertas }: Props) {
  const t = useThemeTokens()
  const isLight = t.theme === 'light'

  const byTipo = (tipo: AlertaTipo) => sortDesc(alertas.filter((a) => a.tipo_alerta === tipo))

  return (
    <GlassPanel as="section" className="p-5 sm:p-8">
      <div className="mb-6">
        <h2 className={['text-lg font-semibold tracking-tight', t.textPrimary].join(' ')}>Historial de alertas</h2>
        <p className={['mt-1 text-sm', t.textMuted].join(' ')}>
          Registro completo en base de datos (incluye las que ocultó con “Limpiar recientes” en este navegador). Cuatro
          columnas por tipo y severidad, con el mismo código de color que arriba.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLS.map((c) => (
          <Column
            key={c.tipo}
            tipo={c.tipo}
            title={c.title}
            subtitle={c.subtitle}
            rows={byTipo(c.tipo)}
            isLight={isLight}
            t={t}
          />
        ))}
      </div>
    </GlassPanel>
  )
}
