export type SupabasePublicConfig = {
  baseUrl: string
  anonKey: string
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

  if (!baseUrl || !anonKey) {
    throw new Error(
      'Faltan variables de entorno. Defina VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en dashboard/.env (local) o en Vercel → Settings → Environment Variables.',
    )
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    anonKey,
  }
}
