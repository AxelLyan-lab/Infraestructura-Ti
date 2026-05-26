import { useMemo } from 'react'
import { getSupabasePublicConfig, type SupabasePublicConfig } from '../../data/env'
import { useAlertasFeed } from '../../logic/useAlertasFeed'
import { useDismissedAlertas } from '../../logic/useDismissedAlertas'
import { useSensoresDashboard } from '../../logic/useSensoresDashboard'
import { AlertasHistorialSection } from '../components/AlertasHistorialSection'
import { AlertsSection } from '../components/AlertsSection'
import { DashboardShell } from '../components/DashboardShell'
import { GlassPanel } from '../components/GlassPanel'
import { HumidityChart } from '../components/HumidityChart'
import { LiveStatusPill } from '../components/LiveStatusPill'
import { MetricCard } from '../components/MetricCard'
import { TemperatureChart } from '../components/TemperatureChart'
import { ThemeToggle } from '../components/ThemeToggle'
import { useThemeTokens } from '../theme/themeTokens'
import { toChronologicalChartPoints } from '../utils/chartSeries'

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function DashboardWithConfig({ cfg }: { cfg: SupabasePublicConfig }) {
  const t = useThemeTokens()
  const { dismissedIds, dismissIds } = useDismissedAlertas()
  const { readings, latest, loading, error, lastSyncedAt } = useSensoresDashboard(cfg)
  const {
    alertas,
    loading: alertsLoading,
    error: alertsError,
  } = useAlertasFeed(cfg)
  const chartPoints = useMemo(() => toChronologicalChartPoints(readings), [readings])

  const recentAlertas = useMemo(
    () => alertas.filter((a) => !dismissedIds.has(a.id)).slice(0, 50),
    [alertas, dismissedIds],
  )

  const accentTempC = useMemo(() => {
    if (latest) return latest.temperatura
    if (chartPoints.length > 0) return chartPoints[chartPoints.length - 1].temperatura
    return 20
  }, [latest, chartPoints])

  const accentHumPct = useMemo(() => {
    if (latest) return latest.humedad
    if (chartPoints.length > 0) return chartPoints[chartPoints.length - 1].humedad
    return 50
  }, [latest, chartPoints])

  const tempText = latest ? `${latest.temperatura.toFixed(1)} °C` : '—'
  const humText = latest ? `${latest.humedad.toFixed(1)} %` : '—'
  const isLive = Boolean(latest)
  const isLight = t.theme === 'light'

  const handleClearRecent = () => {
    dismissIds(recentAlertas.map((a) => a.id))
  }

  return (
    <DashboardShell>
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={['text-xs font-semibold uppercase tracking-[0.35em]', t.textEyebrow].join(' ')}>
            Infraestructura IoT
          </p>
          <h1 className={['mt-3 text-3xl font-semibold tracking-tight sm:text-4xl', t.textPrimary].join(' ')}>
            Panel ambiental
          </h1>
          <p className={['mt-2 max-w-xl text-sm leading-relaxed', t.textMuted].join(' ')}>
            Lecturas en tiempo casi real desde ESP32 + DHT22, persistidas en Supabase y visualizadas con una interfaz
            minimalista inspirada en los paneles de control de Apple.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <ThemeToggle />
          <LiveStatusPill isLive={isLive} lastSyncedAt={lastSyncedAt} />
        </div>
      </header>

      <main className="mt-10 flex flex-1 flex-col gap-6">
        {error ? (
          <GlassPanel className={['p-5', t.errorBanner].join(' ')}>
            <p className={['text-sm font-medium', isLight ? 'text-rose-900' : 'text-rose-100'].join(' ')}>
              No se pudo leer Supabase
            </p>
            <p className={['mt-2 text-sm', isLight ? 'text-rose-800/90' : 'text-rose-100/75'].join(' ')}>{error}</p>
          </GlassPanel>
        ) : null}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {loading ? (
            <>
              <div
                className={[
                  'h-40 animate-pulse rounded-3xl ring-1',
                  isLight ? 'bg-slate-900/[0.04] ring-slate-900/10' : 'bg-white/[0.05] ring-white/10',
                ].join(' ')}
              />
              <div
                className={[
                  'h-40 animate-pulse rounded-3xl ring-1',
                  isLight ? 'bg-slate-900/[0.04] ring-slate-900/10' : 'bg-white/[0.05] ring-white/10',
                ].join(' ')}
              />
            </>
          ) : (
            <>
              <MetricCard
                title="Temperatura actual"
                value={tempText}
                subtitle={latest ? `Sensor · ${formatShortDate(latest.fecha)}` : 'Aún no hay lecturas en la tabla'}
                accent="sky"
              />
              <MetricCard
                title="Humedad relativa"
                value={humText}
                subtitle={latest ? 'DHT22 (AM2302) · GPIO23' : 'Verifique el firmware y las políticas RLS'}
                accent="violet"
              />
            </>
          )}
        </section>

        <AlertsSection
          recentAlertas={recentAlertas}
          totalCargadas={alertas.length}
          loading={alertsLoading}
          error={alertsError}
          onClearRecent={handleClearRecent}
        />

        <GlassPanel as="section" className="p-5 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className={['text-lg font-semibold tracking-tight', t.textPrimary].join(' ')}>Temperatura · serie</h2>
              <p className={['text-sm', t.textMuted].join(' ')}>Histórico de °C (eje 0–100).</p>
            </div>
            <p className={['text-xs uppercase tracking-[0.22em]', t.textEyebrow].join(' ')}>
              {chartPoints.length ? `${chartPoints.length} muestras` : 'Sin serie'}
            </p>
          </div>
          <div className="mt-6">
            {loading ? (
              <div
                className={[
                  'h-[300px] animate-pulse rounded-2xl ring-1 sm:h-[360px]',
                  isLight ? 'bg-slate-900/[0.04] ring-slate-900/10' : 'bg-white/[0.04] ring-white/10',
                ].join(' ')}
              />
            ) : chartPoints.length < 2 ? (
              <p className={['py-16 text-center text-sm', t.textMuted].join(' ')}>
                Se necesitan al menos dos lecturas para trazar la serie.
              </p>
            ) : (
              <TemperatureChart data={chartPoints} accentTempC={accentTempC} />
            )}
          </div>
        </GlassPanel>

        <GlassPanel as="section" className="p-5 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className={['text-lg font-semibold tracking-tight', t.textPrimary].join(' ')}>Humedad · serie</h2>
              <p className={['text-sm', t.textMuted].join(' ')}>Histórico de % HR (eje 0–100).</p>
            </div>
            <p className={['text-xs uppercase tracking-[0.22em]', t.textEyebrow].join(' ')}>
              {chartPoints.length ? `${chartPoints.length} muestras` : 'Sin serie'}
            </p>
          </div>
          <div className="mt-6">
            {loading ? (
              <div
                className={[
                  'h-[300px] animate-pulse rounded-2xl ring-1 sm:h-[360px]',
                  isLight ? 'bg-slate-900/[0.04] ring-slate-900/10' : 'bg-white/[0.04] ring-white/10',
                ].join(' ')}
              />
            ) : chartPoints.length < 2 ? (
              <p className={['py-16 text-center text-sm', t.textMuted].join(' ')}>
                Se necesitan al menos dos lecturas para trazar la serie.
              </p>
            ) : (
              <HumidityChart data={chartPoints} accentHumPct={accentHumPct} />
            )}
          </div>
        </GlassPanel>

        <AlertasHistorialSection alertas={alertas} />
      </main>

      <footer className={['mt-12 text-center text-[11px]', t.footer].join(' ')}>
        React + Vite · Tailwind · Recharts · Supabase PostgREST
      </footer>
    </DashboardShell>
  )
}

export function DashboardPage() {
  const t = useThemeTokens()
  const cfg = useMemo(() => {
    try {
      return getSupabasePublicConfig()
    } catch {
      return null
    }
  }, [])

  if (!cfg) {
    return (
      <DashboardShell>
        <div className="mb-8 flex justify-end">
          <ThemeToggle />
        </div>
        <GlassPanel className="mx-auto max-w-xl p-8">
          <h1 className={['text-lg font-semibold tracking-tight', t.textPrimary].join(' ')}>Configuración requerida</h1>
          <p className={['mt-3 text-sm leading-relaxed', t.textMuted].join(' ')}>
            Cree el archivo <span className={t.textPrimary}>dashboard/.env</span> con{' '}
            <span
              className={[
                'font-mono text-[13px]',
                t.theme === 'light' ? 'text-sky-700' : 'text-sky-200/90',
              ].join(' ')}
            >
              VITE_SUPABASE_URL
            </span>{' '}
            y{' '}
            <span
              className={[
                'font-mono text-[13px]',
                t.theme === 'light' ? 'text-sky-700' : 'text-sky-200/90',
              ].join(' ')}
            >
              VITE_SUPABASE_ANON_KEY
            </span>
            , luego reinicie <span className={t.textSecondary}>npm run dev</span>.
          </p>
        </GlassPanel>
      </DashboardShell>
    )
  }

  return <DashboardWithConfig cfg={cfg} />
}
