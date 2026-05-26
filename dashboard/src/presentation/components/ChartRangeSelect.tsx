import type { ChartRangeId } from '../../logic/chartRange'
import { CHART_RANGE_OPTIONS } from '../../logic/chartRange'
import { useThemeTokens } from '../theme/themeTokens'

type Props = {
  value: ChartRangeId
  onChange: (id: ChartRangeId) => void
  disabled?: boolean
}

export function ChartRangeSelect({ value, onChange, disabled }: Props) {
  const t = useThemeTokens()
  const isLight = t.theme === 'light'

  return (
    <label className="flex flex-col gap-1.5 sm:items-end">
      <span className={['text-[10px] font-semibold uppercase tracking-[0.2em]', t.textEyebrow].join(' ')}>
        Rango temporal
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as ChartRangeId)}
        className={[
          'min-w-[200px] rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isLight
            ? 'border-slate-900/12 bg-white/80 text-slate-900 shadow-sm hover:border-slate-900/20'
            : 'border-white/15 bg-white/[0.08] text-white/90 hover:border-white/25',
        ].join(' ')}
      >
        {CHART_RANGE_OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
