import type { AlertaRow } from '../types/alertas'
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

export async function fetchRecentAlertas(
  cfg: SupabasePublicConfig,
  limit = 400,
): Promise<AlertaRow[]> {
  const url = new URL(`${cfg.baseUrl}/rest/v1/alertas`)
  url.searchParams.set('select', 'id,tipo_alerta,valor,mensaje,fecha')
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

  const data = (await res.json()) as AlertaRow[]
  return Array.isArray(data) ? data : []
}
