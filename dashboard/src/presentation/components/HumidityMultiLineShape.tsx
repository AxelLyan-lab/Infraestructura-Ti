import type { CSSProperties, ReactElement } from 'react'
import { useDashboardTheme } from '../theme/useDashboardTheme'
import type { ChartPoint } from '../utils/chartSeries'
import { getHumidityStrokeSegment } from '../utils/humidityColor'

type Pt = {
  x: number
  y: number
  value?: number | string
  payload?: ChartPoint
}

function readHum(p: Pt): number {
  if (typeof p.payload?.humedad === 'number') return p.payload.humedad
  const v = Number(p.value)
  return Number.isFinite(v) ? v : Number.NaN
}

export function HumidityMultiLineShape(props: Record<string, unknown>) {
  const { theme } = useDashboardTheme()
  const isDark = theme === 'dark'
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
    const h0 = readHum(p0)
    const h1 = readHum(p1)
    if (!Number.isFinite(h0) || !Number.isFinite(h1)) continue
    const stroke = getHumidityStrokeSegment(h0, h1, isDark)
    const key = `hs-${i}`
    under.push(
      <line
        key={`u-${key}`}
        x1={p0.x}
        y1={p0.y}
        x2={p1.x}
        y2={p1.y}
        stroke={stroke}
        strokeOpacity={isDark ? 0.28 : 0.2}
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

  const underlayStyle: CSSProperties = isDark
    ? { mixBlendMode: 'screen' }
    : { mixBlendMode: 'multiply', opacity: 0.78 }

  return (
    <g className="recharts-humidity-multiline">
      <g style={underlayStyle}>{under}</g>
      <g>{over}</g>
    </g>
  )
}
