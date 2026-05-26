import type { CSSProperties, ReactElement } from 'react'
import { useDashboardTheme } from '../theme/useDashboardTheme'
import type { ChartPoint } from '../utils/chartSeries'
import { getTemperatureStrokeSegment } from '../utils/temperatureColor'

type Pt = {
  x: number
  y: number
  value?: number | string
  payload?: ChartPoint
}

function readTemp(p: Pt): number {
  if (typeof p.payload?.temperatura === 'number') return p.payload.temperatura
  const v = Number(p.value)
  return Number.isFinite(v) ? v : Number.NaN
}

export function TemperatureMultiLineShape(props: Record<string, unknown>) {
  const { theme } = useDashboardTheme()
  const raw = props.points as Pt[] | undefined
  const points = raw?.filter(
    (p) =>
      typeof p?.x === 'number' &&
      typeof p?.y === 'number' &&
      Number.isFinite(p.x) &&
      Number.isFinite(p.y),
  )
  if (!points || points.length < 2) return null

  const under: ReactElement[] = []
  const over: ReactElement[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const t0 = readTemp(p0)
    const t1 = readTemp(p1)
    if (!Number.isFinite(t0) || !Number.isFinite(t1)) continue
    const stroke = getTemperatureStrokeSegment(t0, t1)
    const key = `ts-${i}`
    under.push(
      <line
        key={`u-${key}`}
        x1={p0.x}
        y1={p0.y}
        x2={p1.x}
        y2={p1.y}
        stroke={stroke}
        strokeOpacity={theme === 'dark' ? 0.26 : 0.18}
        strokeWidth={6.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ shapeRendering: 'geometricPrecision' }}
      />,
    )
    over.push(
      <line
        key={`o-${key}`}
        x1={p0.x}
        y1={p0.y}
        x2={p1.x}
        y2={p1.y}
        stroke={stroke}
        strokeWidth={3.05}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ shapeRendering: 'geometricPrecision' }}
      />,
    )
  }

  const underlayStyle: CSSProperties =
    theme === 'dark'
      ? { mixBlendMode: 'screen' }
      : { mixBlendMode: 'multiply', opacity: 0.72 }

  return (
    <g className="recharts-temperature-multiline">
      <g style={underlayStyle}>{under}</g>
      <g>{over}</g>
    </g>
  )
}
