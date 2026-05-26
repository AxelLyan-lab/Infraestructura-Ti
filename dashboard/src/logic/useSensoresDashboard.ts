import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchRecentSensores } from '../data/sensoresRepository'
import type { SupabasePublicConfig } from '../data/env'
import { POLL_MS } from './pollMs'
import type { SensorReading } from '../types/sensor'

export function useSensoresDashboard(cfg: SupabasePublicConfig) {
  const [readings, setReadings] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)
  const firstLoad = useRef(true)

  const load = useCallback(async () => {
    const initial = firstLoad.current
    if (initial) setLoading(true)
    else setIsSyncing(true)

    try {
      setError(null)
      const rows = await fetchRecentSensores(cfg, 144)
      setReadings(rows)
      setLastSyncedAt(new Date())
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error desconocido'
      setError(message)
    } finally {
      if (initial) {
        setLoading(false)
        firstLoad.current = false
      }
      setIsSyncing(false)
    }
  }, [cfg])

  useEffect(() => {
    const initial = window.setTimeout(() => void load(), 0)
    const id = window.setInterval(() => void load(), POLL_MS)
    return () => {
      window.clearTimeout(initial)
      window.clearInterval(id)
    }
  }, [load])

  const latest = useMemo(() => {
    if (readings.length === 0) return null
    return readings.reduce((best, cur) => {
      return new Date(cur.fecha).getTime() >= new Date(best.fecha).getTime() ? cur : best
    }, readings[0])
  }, [readings])

  return {
    readings,
    latest,
    loading,
    isSyncing,
    error,
    lastSyncedAt,
    reload: load,
  }
}
