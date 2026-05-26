import type { AlertaTipo } from '../../types/alertas'

export type AlertSeverityStyle = {
  label: string
  ring: string
  border: string
  chip: string
}

export function severityForTipo(tipo: AlertaTipo, isLight: boolean): AlertSeverityStyle {
  switch (tipo) {
    case 'temperatura_advertencia':
      return {
        label: 'Advertencia · temperatura',
        ring: 'from-amber-400/35 via-yellow-300/12 to-transparent',
        border: isLight ? 'border-amber-400/40' : 'border-amber-300/35',
        chip: isLight
          ? 'bg-amber-400/15 text-amber-950 ring-1 ring-amber-500/25'
          : 'bg-amber-400/15 text-amber-50 ring-1 ring-amber-400/30',
      }
    case 'temperatura_critica':
      return {
        label: 'Crítico · temperatura',
        ring: 'from-fuchsia-500/35 via-rose-400/15 to-transparent',
        border: isLight ? 'border-fuchsia-500/30' : 'border-fuchsia-400/35',
        chip: isLight
          ? 'bg-fuchsia-500/12 text-fuchsia-950 ring-1 ring-fuchsia-500/25'
          : 'bg-fuchsia-500/15 text-fuchsia-100 ring-1 ring-fuchsia-400/30',
      }
    case 'humedad_advertencia':
      return {
        label: 'Advertencia · humedad',
        ring: 'from-amber-400/35 via-orange-300/14 to-transparent',
        border: isLight ? 'border-orange-400/45' : 'border-orange-300/40',
        chip: isLight
          ? 'bg-orange-400/18 text-orange-950 ring-1 ring-orange-500/28'
          : 'bg-orange-400/18 text-orange-50 ring-1 ring-orange-400/32',
      }
    case 'humedad_critica':
    default:
      return {
        label: 'Crítico · humedad',
        ring: 'from-rose-500/35 via-fuchsia-500/22 to-transparent',
        border: isLight ? 'border-rose-500/40' : 'border-rose-400/38',
        chip: isLight
          ? 'bg-rose-600/14 text-rose-950 ring-1 ring-fuchsia-600/25'
          : 'bg-rose-500/18 text-rose-50 ring-1 ring-fuchsia-400/32',
      }
  }
}

/** Barra lateral y filas del historial (misma familia cromática que alertas recientes). */
export function historialAccent(tipo: AlertaTipo): { bar: string; row: string } {
  switch (tipo) {
    case 'temperatura_advertencia':
      return {
        bar: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.45)]',
        row: 'border-amber-300/50 bg-amber-500/[0.08] dark:border-amber-400/30 dark:bg-amber-400/[0.08]',
      }
    case 'temperatura_critica':
      return {
        bar: 'bg-fuchsia-500 shadow-[0_0_14px_rgba(217,70,239,0.45)]',
        row: 'border-fuchsia-300/50 bg-fuchsia-500/[0.08] dark:border-fuchsia-400/35 dark:bg-fuchsia-500/[0.1]',
      }
    case 'humedad_advertencia':
      return {
        bar: 'bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.5)]',
        row: 'border-orange-300/55 bg-orange-500/[0.1] dark:border-orange-400/35 dark:bg-orange-400/[0.1]',
      }
    case 'humedad_critica':
    default:
      return {
        bar: 'bg-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.45)]',
        row: 'border-rose-300/50 bg-fuchsia-600/[0.1] dark:border-rose-400/35 dark:bg-fuchsia-500/[0.1]',
      }
  }
}
