import type { SensorReading } from '../types/sensor'
import type { SupabasePublicConfig } from './env'

const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
} as const

function authHeaders(cfg: SupabasePublicConfig) {
  return {
    ...JSON_HEADERS,
    apikey: cfg.anonKey,
    Authorization: `Bearer ${cfg.anonKey}`,
  }
}

export async function fetchRecentSensores(
  cfg: SupabasePublicConfig,
  limit = 120,
): Promise<SensorReading[]> {
  const url = new URL(`${cfg.baseUrl}/rest/v1/sensores`)
  url.searchParams.set('select', 'id,temperatura,humedad,fecha')
  url.searchParams.set('order', 'fecha.desc')
  url.searchParams.set('limit', String(limit))

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: authHeaders(cfg),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Supabase REST ${res.status}: ${text || res.statusText}`)
  }

  const data = (await res.json()) as SensorReading[]
  return Array.isArray(data) ? data : []
}
