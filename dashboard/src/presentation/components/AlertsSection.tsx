import type { AlertaRow } from '../../types/alertas'
import { severityForTipo } from '../utils/alertPresentation'
import { useThemeTokens } from '../theme/themeTokens'
import { GlassPanel } from './GlassPanel'
import { getHumidityStroke } from '../utils/humidityColor'
import { getTemperatureStroke } from '../utils/temperatureColor'

function IconThermAlert({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5v9.2l1.6 1.1a3.3 3.3 0 1 1-3.2 0L12 12.7V3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 20h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconDroplet({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3s5 5.2 5 9.5a5 5 0 1 1-10 0C7 8.2 12 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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

/** Fondo del cuadro de iconos: crítica “color ojo” (miel/ámbar); advertencia amarillo/naranja vivo. */
function alertIconShellSeverity(isCritica: boolean, isLight: boolean): string {
  if (isCritica) {
    return isLight
      ? 'bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 ring-1 ring-amber-900/15'
      : 'bg-gradient-to-br from-amber-950/55 via-amber-900/35 to-orange-950/45 ring-1 ring-amber-500/35'
  }
  return isLight
    ? 'bg-gradient-to-br from-amber-200/95 via-yellow-50 to-orange-100 ring-1 ring-orange-400/55'
    : 'bg-gradient-to-br from-yellow-500/22 via-orange-500/18 to-amber-600/22 ring-1 ring-orange-400/45'
}

/** Glifo termómetro rojo, gota azul (identidad de magnitud). */
function alertIconGlyphClass(isTemp: boolean, isLight: boolean): string {
  if (isTemp) return isLight ? 'text-rose-600' : 'text-rose-300'
  return isLight ? 'text-sky-600' : 'text-sky-300'
}

/** Recuadro exterior de la pastilla “Crítico · …” (rojo) o “Advertencia · …” (amarillo/naranja). */
function severityLabelFrame(isCritica: boolean, isLight: boolean): string {
  if (isCritica) {
    return isLight
      ? 'inline-flex rounded-full p-[3px] ring-2 ring-red-600 bg-red-50/55 shadow-sm'
      : 'inline-flex rounded-full p-[3px] ring-2 ring-red-500 bg-red-950/45 shadow-[0_0_22px_rgba(239,68,68,0.22)]'
  }
  return isLight
    ? 'inline-flex rounded-full p-[3px] ring-2 ring-amber-500 bg-amber-50/70 shadow-sm'
    : 'inline-flex rounded-full p-[3px] ring-2 ring-orange-400 bg-amber-950/40'
}

function hexToRgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return `rgba(148,163,184,${alpha})`
  const x = m[1]
  const r = Number.parseInt(x.slice(0, 2), 16)
  const g = Number.parseInt(x.slice(2, 4), 16)
  const b = Number.parseInt(x.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

type AlertsSectionProps = {
  recentAlertas: AlertaRow[]
  totalCargadas: number
  loading: boolean
  error: string | null
  onClearRecent: () => void
}

export function AlertsSection({
  recentAlertas,
  totalCargadas,
  loading,
  error,
  onClearRecent,
}: AlertsSectionProps) {
  const t = useThemeTokens()
  const isLight = t.theme === 'light'

  return (
    <GlassPanel as="section" className="p-5 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className={['text-lg font-semibold tracking-tight', t.textPrimary].join(' ')}>Alertas recientes</h2>
          <p className={['mt-1 text-sm', t.textMuted].join(' ')}>
            Advertencia: tonos amarillo/naranja. Crítica: rojo/morado (en temperatura y humedad). Umbrales: temperatura{' '}
            {'>'} 30 °C (advertencia) y {'>'} 45 °C (crítica); humedad {'>'} 60 % (advertencia) y {'>'} 80 % (crítica).
            Cooldown 10 min por tipo. “Limpiar recientes” solo oculta en este navegador; el historial al final del panel
            conserva todo en Supabase. El marco rojo o amarillo/naranja rodea la etiqueta Advertencia/Crítico; el número
            usa el mismo color que el gráfico en ese valor. Termómetro en rojo y gota en azul.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
          <div
            className={['flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em]', t.textEyebrow].join(
              ' ',
            )}
          >
            <span>
              {recentAlertas.length} visibles · {totalCargadas} cargadas
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onClearRecent}
              disabled={recentAlertas.length === 0}
              className={[
                'rounded-2xl px-4 py-2 text-xs font-semibold transition-all duration-300',
                'disabled:cursor-not-allowed disabled:opacity-40',
                isLight
                  ? 'border border-slate-900/10 bg-white/70 text-slate-800 hover:bg-white'
                  : 'border border-white/15 bg-white/[0.08] text-white/90 hover:bg-white/[0.12]',
              ].join(' ')}
            >
              Limpiar recientes
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div
          className={[
            'mt-5 rounded-2xl border px-4 py-3 text-sm',
            t.errorBanner,
            isLight ? 'text-rose-900' : 'text-rose-100/90',
          ].join(' ')}
        >
          {error}
        </div>
      ) : null}

      <div className="alerts-scroll mt-6 max-h-[min(52vh,520px)] space-y-3 overflow-y-auto pr-1">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((k) => (
              <div
                key={k}
                className={[
                  'h-24 animate-pulse rounded-2xl ring-1',
                  isLight ? 'bg-slate-900/[0.04] ring-slate-900/10' : 'bg-white/[0.05] ring-white/10',
                ].join(' ')}
              />
            ))}
          </div>
        ) : recentAlertas.length === 0 ? (
          <p className={['py-10 text-center text-sm', t.textMuted].join(' ')}>
            No hay alertas recientes visibles: o bien no hay umbrales superados, o ya las limpió en este navegador.
            Consulte el historial al final del panel o espere nuevas lecturas desde el sensor.
          </p>
        ) : (
          recentAlertas.map((a) => {
            const sev = severityForTipo(a.tipo_alerta, isLight)
            const isTemp = a.tipo_alerta.startsWith('temperatura')
            const isCritica = a.tipo_alerta.includes('critica')
            const isDark = t.theme === 'dark'
            const chartStroke = isTemp ? getTemperatureStroke(a.valor) : getHumidityStroke(a.valor, isDark)
            return (
              <article
                key={a.id}
                className={[
                  'group relative overflow-hidden rounded-2xl border p-4 backdrop-blur-2xl transition-all duration-500',
                  isLight
                    ? 'bg-white/50 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.22)] motion-safe:hover:border-slate-900/15'
                    : 'bg-white/[0.04] shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] motion-safe:hover:border-white/20',
                  'motion-safe:hover:-translate-y-0.5',
                  sev.border,
                ].join(' ')}
              >
                <div
                  className={[
                    'pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-90',
                    sev.ring,
                  ].join(' ')}
                />
                <div className="relative flex gap-4">
                  <div
                    className={[
                      'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                      alertIconShellSeverity(isCritica, isLight),
                    ].join(' ')}
                  >
                    {isTemp ? (
                      <IconThermAlert className={['h-5 w-5', alertIconGlyphClass(true, isLight)].join(' ')} />
                    ) : (
                      <IconDroplet className={['h-5 w-5', alertIconGlyphClass(false, isLight)].join(' ')} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={severityLabelFrame(isCritica, isLight)}>
                        <span className={`block rounded-full px-2.5 py-1 text-[11px] font-semibold ${sev.chip}`}>
                          {sev.label}
                        </span>
                      </span>
                      <span className={['text-xs', t.textEyebrow].join(' ')}>{formatAlertTimestamp(a.fecha)}</span>
                    </div>
                    <p className={['mt-2 text-[15px] font-medium leading-snug tracking-tight', t.textPrimary].join(' ')}>
                      {a.mensaje}
                    </p>
                    <p className={['mt-1 text-xs', t.textMuted].join(' ')}>
                      Valor detectado:{' '}
                      <span
                        className="inline-block rounded-md px-2 py-0.5 text-sm font-bold tabular-nums ring-1 ring-slate-900/10 dark:ring-white/12"
                        style={{
                          color: chartStroke,
                          backgroundColor: hexToRgba(chartStroke, isDark ? 0.16 : 0.14),
                          boxShadow: `0 0 18px ${hexToRgba(chartStroke, 0.35)}`,
                        }}
                      >
                        {isTemp ? `${a.valor.toFixed(1)} °C` : `${a.valor.toFixed(1)} %`}
                      </span>
                    </p>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </GlassPanel>
  )
}
