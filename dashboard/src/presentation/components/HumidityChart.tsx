import { useId, useMemo } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useThemeTokens } from '../theme/themeTokens'
import { densifyChartPoints, type ChartPoint } from '../utils/chartSeries'
import { getHumidityStroke } from '../utils/humidityColor'
import { HumidityMultiLineShape } from './HumidityMultiLineShape'

type Props = {
  data: ChartPoint[]
  accentHumPct: number
}

type TipProps = {
  active?: boolean
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: number }>
  label?: string | number
}

function HumTooltip({ active, payload, label }: TipProps) {
  const t = useThemeTokens()
  const isDark = t.theme === 'dark'
  if (!active || !payload?.length) return null
  const hum = payload.find((p) => p.dataKey === 'humedad')?.value
  const humColor = typeof hum === 'number' ? getHumidityStroke(hum, isDark) : '#94a3b8'
  const labelText =
    typeof label === 'number' && Number.isFinite(label)
      ? new Date(label).toLocaleTimeString('es', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : typeof label === 'string'
        ? label
        : ''

  return (
    <div className={t.tooltipShell}>
      <p className={['mb-3 text-[11px] uppercase tracking-[0.2em]', t.tooltipMuted].join(' ')}>{labelText}</p>
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: humColor, boxShadow: `0 0 18px ${humColor}55` }}
        />
        <p className={['text-sm', t.textSecondary].join(' ')}>
          Humedad{' '}
          <span className="font-semibold tabular-nums" style={{ color: humColor }}>
            {typeof hum === 'number' ? hum.toFixed(2) : '—'} %
          </span>
        </p>
      </div>
    </div>
  )
}

export function HumidityChart({ data, accentHumPct }: Props) {
  const t = useThemeTokens()
  const isDark = t.theme === 'dark'
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const gid = `hm-${rawId}`
  const plotData = useMemo(() => densifyChartPoints(data), [data])
  const fillTop = useMemo(() => getHumidityStroke(accentHumPct, isDark), [accentHumPct, isDark])
  const tickFill = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.55)'

  return (
    <div className="h-[300px] w-full sm:h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={plotData} margin={{ top: 14, right: 12, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id={`${gid}-humFill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillTop} stopOpacity={isDark ? 0.5 : 0.4} />
              <stop offset="55%" stopColor={fillTop} stopOpacity={isDark ? 0.12 : 0.1} />
              <stop offset="100%" stopColor={fillTop} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={t.chartGrid} vertical={false} />
          <XAxis
            type="number"
            dataKey="tMs"
            domain={['dataMin', 'dataMax']}
            scale="time"
            tick={{ fill: tickFill, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: t.chartAxis }}
            tickFormatter={(v) =>
              typeof v === 'number' && Number.isFinite(v)
                ? new Date(v).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
                : ''
            }
            minTickGap={28}
          />
          <YAxis
            yAxisId="h"
            width={46}
            domain={[0, 100]}
            allowDataOverflow
            tick={{ fill: tickFill, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}`}
            label={{
              value: '% HR',
              position: 'insideTopLeft',
              fill: t.chartAxisLabel,
              fontSize: 11,
            }}
          />
          <Tooltip content={<HumTooltip />} cursor={{ stroke: t.chartCursor, strokeWidth: 1 }} />
          <Area
            yAxisId="h"
            type="monotone"
            dataKey="humedad"
            stroke="transparent"
            fill={`url(#${gid}-humFill)`}
            fillOpacity={1}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            activeDot={false}
          />
          <Line
            yAxisId="h"
            type="monotone"
            dataKey="humedad"
            stroke="transparent"
            strokeOpacity={0}
            strokeWidth={0}
            dot={false}
            isAnimationActive={false}
            shape={<HumidityMultiLineShape />}
            activeDot={{ r: 5, strokeWidth: 0, fill: '#ffffff', opacity: 0.95 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
