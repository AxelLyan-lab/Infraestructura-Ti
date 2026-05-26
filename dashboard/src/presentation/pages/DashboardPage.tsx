import { useMemo, useState } from 'react'
import { getSupabasePublicConfig, type SupabasePublicConfig } from '../../data/env'
import { useAlertasFeed } from '../../logic/useAlertasFeed'
import { useChartSensores } from '../../logic/useChartSensores'
import type { ChartRangeId } from '../../logic/chartRange'
import { chartRangeById } from '../../logic/chartRange'
import { useDismissedAlertas } from '../../logic/useDismissedAlertas'
import { useSensoresDashboard } from '../../logic/useSensoresDashboard'
import { AlertasHistorialSection } from '../components/AlertasHistorialSection'
import { AlertsSection } from '../components/AlertsSection'
import { ChartRangeSelect } from '../components/ChartRangeSelect'
import { DashboardShell } from '../components/DashboardShell'
import { GlassPanel } from '../components/GlassPanel'
import { HumidityChart } from '../components/HumidityChart'
import { LiveStatusPill } from '../components/LiveStatusPill'
import { MetricCard } from '../components/MetricCard'
import { TemperatureChart } from '../components/TemperatureChart'
import { ThemeToggle } from '../components/ThemeToggle'
import { useThemeTokens } from '../theme/themeTokens'
import { toChronologicalChartPoints } from '../utils/chartSeries'

function DashboardWithConfig({ cfg }: { cfg: SupabasePublicConfig }) {
  const t = useThemeTokens()
  const [tempChartRangeId, setTempChartRangeId] = useState<ChartRangeId>('live')
  const [humChartRangeId, setHumChartRangeId] = useState<ChartRangeId>('live')
  const { dismissedIds, dismissIds } = useDismissedAlertas()
  const { latest, loading, error, lastSyncedAt } = useSensoresDashboard(cfg)
  const {
    readings: tempChartReadings,
    loading: tempChartLoading,
    error: tempChartError,
  } = useChartSensores(cfg, tempChartRangeId)
  const {
    readings: humChartReadings,
    loading: humChartLoading,
    error: humChartError,
  } = useChartSensores(cfg, humChartRangeId)
  const {
    alertas,
    loading: alertsLoading,
    error: alertsError,
  } = useAlertasFeed(cfg)

  const tempChartPoints = useMemo(
    () => toChronologicalChartPoints(tempChartReadings),
    [tempChartReadings],
  )
  const humChartPoints = useMemo(() => toChronologicalChartPoints(humChartReadings), [humChartReadings])
  const tempRangeLabel = chartRangeById(tempChartRangeId).label
  const humRangeLabel = chartRangeById(humChartRangeId).label

  const recentAlertas = useMemo(
    () => alertas.filter((a) => !dismissedIds.has(a.id)).slice(0, 50),
    [alertas, dismissedIds],
  )

  const accentTempC = useMemo(() => {
    if (latest) return latest.temperatura
    if (tempChartPoints.length > 0) return tempChartPoints[tempChartPoints.length - 1].temperatura
    return 20
  }, [latest, tempChartPoints])

  const accentHumPct = useMemo(() => {
    if (latest) return latest.humedad
    if (humChartPoints.length > 0) return humChartPoints[humChartPoints.length - 1].humedad
    return 50
  }, [latest, humChartPoints])

  const tempText = latest ? `${latest.temperatura.toFixed(1)} °C` : '—'
  const humText = latest ? `${latest.humedad.toFixed(1)} %` : '—'
  const isLive = Boolean(latest)
  const isLight = t.theme === 'light'
  const tempChartBusy = tempChartLoading || loading
  const humChartBusy = humChartLoading || loading

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
            Lecturas en tiempo casi real desde ESP32 + DHT22, persistidas en Supabase.
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
              <MetricCard title="Temperatura actual" value={tempText} accent="sky" />
              <MetricCard title="Humedad relativa" value={humText} accent="violet" />
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className={['text-lg font-semibold tracking-tight', t.textPrimary].join(' ')}>Temperatura · serie</h2>
              <p className={['text-sm', t.textMuted].join(' ')}>Histórico de °C (eje 0–100).</p>
            </div>
            <ChartRangeSelect
              value={tempChartRangeId}
              onChange={setTempChartRangeId}
              disabled={tempChartBusy}
            />
          </div>
          {tempChartError ? (
            <p className={['mt-2 text-sm', isLight ? 'text-rose-700' : 'text-rose-200/90'].join(' ')}>
              {tempChartError}
            </p>
          ) : null}
          <p className={['mt-2 text-xs uppercase tracking-[0.22em]', t.textEyebrow].join(' ')}>
            {tempChartPoints.length
              ? `${tempChartPoints.length} muestras · ${tempRangeLabel}`
              : `Sin serie · ${tempRangeLabel}`}
          </p>
          <div className="mt-6">
            {tempChartBusy ? (
              <div
                className={[
                  'h-[300px] animate-pulse rounded-2xl ring-1 sm:h-[360px]',
                  isLight ? 'bg-slate-900/[0.04] ring-slate-900/10' : 'bg-white/[0.04] ring-white/10',
                ].join(' ')}
              />
            ) : tempChartPoints.length < 2 ? (
              <p className={['py-16 text-center text-sm', t.textMuted].join(' ')}>
                Se necesitan al menos dos lecturas en el rango seleccionado.
              </p>
            ) : (
              <TemperatureChart data={tempChartPoints} accentTempC={accentTempC} />
            )}
          </div>
        </GlassPanel>

        <GlassPanel as="section" className="p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className={['text-lg font-semibold tracking-tight', t.textPrimary].join(' ')}>Humedad · serie</h2>
              <p className={['text-sm', t.textMuted].join(' ')}>Histórico de % HR (eje 0–100).</p>
            </div>
            <ChartRangeSelect value={humChartRangeId} onChange={setHumChartRangeId} disabled={humChartBusy} />
          </div>
          {humChartError ? (
            <p className={['mt-2 text-sm', isLight ? 'text-rose-700' : 'text-rose-200/90'].join(' ')}>
              {humChartError}
            </p>
          ) : null}
          <p className={['mt-2 text-xs uppercase tracking-[0.22em]', t.textEyebrow].join(' ')}>
            {humChartPoints.length
              ? `${humChartPoints.length} muestras · ${humRangeLabel}`
              : `Sin serie · ${humRangeLabel}`}
          </p>
          <div className="mt-6">
            {humChartBusy ? (
              <div
                className={[
                  'h-[300px] animate-pulse rounded-2xl ring-1 sm:h-[360px]',
                  isLight ? 'bg-slate-900/[0.04] ring-slate-900/10' : 'bg-white/[0.04] ring-white/10',
                ].join(' ')}
              />
            ) : humChartPoints.length < 2 ? (
              <p className={['py-16 text-center text-sm', t.textMuted].join(' ')}>
                Se necesitan al menos dos lecturas en el rango seleccionado.
              </p>
            ) : (
              <HumidityChart data={humChartPoints} accentHumPct={accentHumPct} />
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
