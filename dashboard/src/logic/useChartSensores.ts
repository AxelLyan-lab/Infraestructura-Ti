import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchSensoresSince } from '../data/sensoresRepository'
import type { SupabasePublicConfig } from '../data/env'
import { chartRangeById, type ChartRangeId } from './chartRange'
import { POLL_MS } from './pollMs'
import type { SensorReading } from '../types/sensor'

export function useChartSensores(cfg: SupabasePublicConfig, rangeId: ChartRangeId) {
  const [readings, setReadings] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const firstLoad = useRef(true)

  const load = useCallback(async () => {
    const initial = firstLoad.current
    if (initial) setLoading(true)

    try {
      setError(null)
      const { sinceMs, fetchLimit } = chartRangeById(rangeId)
      const since = new Date(Date.now() - sinceMs)
      const rows = await fetchSensoresSince(cfg, since, fetchLimit)
      setReadings(rows)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error desconocido'
      setError(message)
    } finally {
      if (initial) {
        setLoading(false)
        firstLoad.current = false
      }
    }
  }, [cfg, rangeId])

  useEffect(() => {
    firstLoad.current = true
    const initial = window.setTimeout(() => void load(), 0)
    const id = window.setInterval(() => void load(), POLL_MS)
    return () => {
      window.clearTimeout(initial)
      window.clearInterval(id)
    }
  }, [load])

  return { readings, loading, error, reload: load }
}
