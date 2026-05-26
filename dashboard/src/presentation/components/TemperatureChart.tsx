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
import { getTemperatureStroke } from '../utils/temperatureColor'
import { TemperatureMultiLineShape } from './TemperatureMultiLineShape'

type Props = {
  data: ChartPoint[]
  accentTempC: number
}

type TipProps = {
  active?: boolean
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: number }>
  label?: string | number
}

function TempTooltip({ active, payload, label }: TipProps) {
  const t = useThemeTokens()
  if (!active || !payload?.length) return null
  const temp = payload.find((p) => p.dataKey === 'temperatura')?.value
  const tempColor = typeof temp === 'number' ? getTemperatureStroke(temp) : '#e5e7eb'
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
          style={{ backgroundColor: tempColor, boxShadow: `0 0 18px ${tempColor}55` }}
        />
        <p className={['text-sm', t.textSecondary].join(' ')}>
          Temperatura{' '}
          <span className="font-semibold tabular-nums" style={{ color: tempColor }}>
            {typeof temp === 'number' ? temp.toFixed(2) : '—'} °C
          </span>
        </p>
      </div>
    </div>
  )
}

export function TemperatureChart({ data, accentTempC }: Props) {
  const t = useThemeTokens()
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const gid = `tt-${rawId}`
  const plotData = useMemo(() => densifyChartPoints(data), [data])
  const fillTop = useMemo(() => getTemperatureStroke(accentTempC), [accentTempC])
  const tickFill = t.theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.55)'

  return (
    <div className="h-[300px] w-full sm:h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={plotData} margin={{ top: 14, right: 12, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id={`${gid}-tempFill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillTop} stopOpacity={t.theme === 'dark' ? 0.55 : 0.42} />
              <stop offset="55%" stopColor={fillTop} stopOpacity={t.theme === 'dark' ? 0.12 : 0.1} />
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
            yAxisId="t"
            width={46}
            domain={[0, 100]}
            allowDataOverflow
            tick={{ fill: tickFill, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}`}
            label={{
              value: '°C',
              position: 'insideTopLeft',
              fill: t.chartAxisLabel,
              fontSize: 11,
            }}
          />
          <Tooltip content={<TempTooltip />} cursor={{ stroke: t.chartCursor, strokeWidth: 1 }} />
          <Area
            yAxisId="t"
            type="monotone"
            dataKey="temperatura"
            stroke="transparent"
            fill={`url(#${gid}-tempFill)`}
            fillOpacity={1}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            activeDot={false}
          />
          <Line
            yAxisId="t"
            type="monotone"
            dataKey="temperatura"
            stroke="transparent"
            strokeOpacity={0}
            strokeWidth={0}
            dot={false}
            isAnimationActive={false}
            shape={<TemperatureMultiLineShape />}
            activeDot={{ r: 5, strokeWidth: 0, fill: '#ffffff', opacity: 0.95 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
