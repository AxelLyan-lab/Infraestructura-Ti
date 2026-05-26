export type ChartRangeId = 'live' | '10m' | '1h' | '1d'

export type ChartRangeOption = {
  id: ChartRangeId
  label: string
  sinceMs: number
  /** Límite de filas PostgREST (muestreo ESP32 ~ cada 2 s). */
  fetchLimit: number
}

export const CHART_RANGE_OPTIONS: ChartRangeOption[] = [
  {
    id: 'live',
    label: 'Tiempo real (1 min)',
    sinceMs: 60 * 1000,
    fetchLimit: 80,
  },
  {
    id: '10m',
    label: 'Últimos 10 minutos',
    sinceMs: 10 * 60 * 1000,
    fetchLimit: 350,
  },
  {
    id: '1h',
    label: 'Última hora',
    sinceMs: 60 * 60 * 1000,
    fetchLimit: 2500,
  },
  {
    id: '1d',
    label: 'Último día',
    sinceMs: 24 * 60 * 60 * 1000,
    fetchLimit: 5000,
  },
]

export function chartRangeById(id: ChartRangeId): ChartRangeOption {
  return CHART_RANGE_OPTIONS.find((o) => o.id === id) ?? CHART_RANGE_OPTIONS[0]
}
