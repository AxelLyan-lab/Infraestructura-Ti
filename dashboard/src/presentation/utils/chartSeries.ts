import type { SensorReading } from '../../types/sensor'

export type ChartPoint = SensorReading & { label: string; tMs: number }

export function toChronologicalChartPoints(readings: SensorReading[]): ChartPoint[] {
  const sorted = [...readings].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
  )

  return sorted.map((r) => ({
    ...r,
    tMs: new Date(r.fecha).getTime(),
    label: new Date(r.fecha).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  }))
}

/** Más puntos a lo largo del tiempo (tMs) para trazos multicolor suaves. */
export function densifyChartPoints(points: ChartPoint[], stepsPerSegment?: number): ChartPoint[] {
  if (points.length < 2) return points
  const segCount = points.length - 1
  const steps =
    stepsPerSegment ?? (segCount > 70 ? 3 : segCount > 45 ? 4 : 5)
  const out: ChartPoint[] = []

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    for (let s = 0; s < steps; s++) {
      const u = s / steps
      const tMs = a.tMs + (b.tMs - a.tMs) * u
      const temperatura = a.temperatura + (b.temperatura - a.temperatura) * u
      const humedad = a.humedad + (b.humedad - a.humedad) * u
      const fecha = new Date(Math.round(tMs)).toISOString()
      out.push({
        id: -(i * 1000 + s + 1),
        temperatura,
        humedad,
        fecha,
        tMs,
        label: new Date(fecha).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      })
    }
  }

  out.push({ ...points[points.length - 1] })
  return out
}
