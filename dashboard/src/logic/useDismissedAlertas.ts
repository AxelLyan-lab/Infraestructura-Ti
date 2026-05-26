import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'iot-alertas-dismissed-ids'

function loadDismissed(): Set<number> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return new Set()
    return new Set(arr.filter((x): x is number => typeof x === 'number' && Number.isFinite(x)))
  } catch {
    return new Set()
  }
}

function persistDismissed(next: Set<number>) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
}

export function useDismissedAlertas() {
  const [dismissed, setDismissed] = useState<Set<number>>(() => loadDismissed())

  useEffect(() => {
    persistDismissed(dismissed)
  }, [dismissed])

  const dismissIds = useCallback((ids: number[]) => {
    if (ids.length === 0) return
    setDismissed((prev) => {
      const n = new Set(prev)
      for (const id of ids) n.add(id)
      return n
    })
  }, [])

  return { dismissedIds: dismissed, dismissIds }
}
