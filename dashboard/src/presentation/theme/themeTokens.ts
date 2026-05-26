import { useMemo } from 'react'
import type { DashboardThemeId } from './dashboardThemeId'
import { useDashboardTheme } from './useDashboardTheme'

export type DashboardUiTokens = {
  theme: DashboardThemeId
  shell: string
  shellNoise: string
  shellVignette: string
  glass: string
  glassHighlight: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  textEyebrow: string
  footer: string
  chartGrid: string
  chartAxis: string
  chartAxisLabel: string
  chartCursor: string
  tooltipShell: string
  tooltipMuted: string
  livePill: string
  errorBanner: string
  humStrokeA: string
  humStrokeB: string
}

function darkTokens(): Omit<DashboardUiTokens, 'theme'> {
  return {
    shell:
      'relative min-h-dvh overflow-hidden bg-[#05060a] text-white transition-colors duration-500 ease-out',
    shellNoise: 'opacity-[0.35] [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:14px_14px]',
    shellVignette:
      'bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0)_28%,rgba(255,255,255,0)_72%,rgba(255,255,255,0.04))]',
    glass:
      'relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-2xl backdrop-saturate-150 transition-[background-color,box-shadow,border-color] duration-500 ease-out',
    glassHighlight:
      'before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02)_45%,rgba(255,255,255,0)_60%)] after:pointer-events-none after:absolute after:inset-0 after:opacity-60 after:shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]',
    textPrimary: 'text-white',
    textSecondary: 'text-white/80',
    textMuted: 'text-white/55',
    textEyebrow: 'text-white/40',
    footer: 'text-white/35',
    chartGrid: 'rgba(255,255,255,0.06)',
    chartAxis: 'rgba(255,255,255,0.08)',
    chartAxisLabel: 'rgba(255,255,255,0.35)',
    chartCursor: 'rgba(255,255,255,0.14)',
    tooltipShell:
      'rounded-2xl border border-white/18 bg-black/60 px-4 py-3 text-xs text-white/80 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl',
    tooltipMuted: 'text-white/45',
    livePill:
      'inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs text-white/70 shadow-lg backdrop-blur-xl transition-colors duration-500',
    errorBanner: 'border-rose-400/25 bg-rose-500/10',
    humStrokeA: '#ddd6fe',
    humStrokeB: '#a78bfa',
  }
}

function lightTokens(): Omit<DashboardUiTokens, 'theme'> {
  return {
    shell:
      'relative min-h-dvh overflow-hidden bg-[#e8ecf7] text-slate-900 transition-colors duration-500 ease-out',
    shellNoise:
      'opacity-[0.45] [background-image:radial-gradient(rgba(15,23,42,0.07)_1px,transparent_1px)] [background-size:15px_15px]',
    shellVignette:
      'bg-[linear-gradient(to_bottom,rgba(255,255,255,0.75),rgba(255,255,255,0)_32%,rgba(255,255,255,0)_68%,rgba(255,255,255,0.55))]',
    glass:
      'relative overflow-hidden rounded-3xl border border-white/80 bg-white/45 shadow-[0_28px_90px_-36px_rgba(15,23,42,0.35)] backdrop-blur-2xl backdrop-saturate-[1.45] transition-[background-color,box-shadow,border-color] duration-500 ease-out ring-1 ring-slate-900/[0.04]',
    glassHighlight:
      'before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.35)_42%,rgba(255,255,255,0)_58%)] after:pointer-events-none after:absolute after:inset-0 after:opacity-90 after:shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-800',
    textMuted: 'text-slate-600',
    textEyebrow: 'text-slate-500',
    footer: 'text-slate-500',
    chartGrid: 'rgba(15,23,42,0.07)',
    chartAxis: 'rgba(15,23,42,0.12)',
    chartAxisLabel: 'rgba(15,23,42,0.45)',
    chartCursor: 'rgba(15,23,42,0.12)',
    tooltipShell:
      'rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-xs text-slate-800 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.35)] backdrop-blur-2xl',
    tooltipMuted: 'text-slate-500',
    livePill:
      'inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/55 px-4 py-2 text-xs text-slate-700 shadow-md backdrop-blur-xl transition-colors duration-500 ring-1 ring-slate-900/[0.04]',
    errorBanner: 'border-rose-300/60 bg-rose-500/[0.12]',
    humStrokeA: '#7c3aed',
    humStrokeB: '#4f46e5',
  }
}

export function useThemeTokens(): DashboardUiTokens {
  const { theme } = useDashboardTheme()
  return useMemo(() => {
    const base = theme === 'light' ? lightTokens() : darkTokens()
    return { theme, ...base }
  }, [theme])
}
