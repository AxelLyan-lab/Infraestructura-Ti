import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchRecentAlertas } from '../data/alertasRepository'
import type { SupabasePublicConfig } from '../data/env'
import type { AlertaRow } from '../types/alertas'
import { ALERTAS_POLL_MS } from './pollMs'

export function useAlertasFeed(cfg: SupabasePublicConfig) {
  const [alertas, setAlertas] = useState<AlertaRow[]>([])
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const firstLoad = useRef(true)

  const load = useCallback(async () => {
    const initial = firstLoad.current
    if (initial) setLoading(true)
    else setIsSyncing(true)

    try {
      setError(null)
      const rows = await fetchRecentAlertas(cfg, 400)
      setAlertas(rows)
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
    const id = window.setInterval(() => void load(), ALERTAS_POLL_MS)
    return () => {
      window.clearTimeout(initial)
      window.clearInterval(id)
    }
  }, [load])

  return { alertas, loading, isSyncing, error, reload: load }
}
