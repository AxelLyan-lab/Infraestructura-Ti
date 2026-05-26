import { hexToHsl, hslToHex, lerpHsl, smoothstep01 } from './colorSpace'

/**
 * Anclas de color en °C (eje 0–100). Entre anclas se interpola en HSL con suavizado
 * para evitar saltos perceptibles y mezclar progresivamente al acercarse al siguiente rango.
 */
const TEMP_ANCHORS: Array<{ t: number; hex: string }> = [
  { t: 0, hex: '#38bdf8' },
  { t: 10, hex: '#4cc4f8' },
  { t: 15, hex: '#38bdf8' },
  { t: 15.8, hex: '#2dd4bf' },
  { t: 16.5, hex: '#22c55e' },
  { t: 20, hex: '#34d399' },
  { t: 25, hex: '#22c55e' },
  { t: 25.6, hex: '#65d33a' },
  { t: 26.4, hex: '#eab308' },
  { t: 30, hex: '#facc15' },
  { t: 35, hex: '#eab308' },
  { t: 35.4, hex: '#fbbf24' },
  { t: 36.2, hex: '#fb923c' },
  { t: 38, hex: '#f97316' },
  { t: 40, hex: '#f97316' },
  { t: 40.4, hex: '#fb7185' },
  { t: 42, hex: '#ef4444' },
  { t: 45, hex: '#ef4444' },
  { t: 45.3, hex: '#e879f9' },
  { t: 46.5, hex: '#a855f7' },
  { t: 55, hex: '#9333ea' },
  { t: 100, hex: '#5b21b6' },
]

function hslAtAnchorIndex(i: number): ReturnType<typeof hexToHsl> {
  return hexToHsl(TEMP_ANCHORS[i].hex)
}

/**
 * Color de trazo continuo para una temperatura °C (0–100).
 * Interpolación HSL entre anclas + ease en el parámetro local del tramo.
 */
export function getTemperatureStroke(tempC: number): string {
  const t = Math.min(100, Math.max(0, tempC))
  for (let i = 0; i < TEMP_ANCHORS.length - 1; i++) {
    const a = TEMP_ANCHORS[i]
    const b = TEMP_ANCHORS[i + 1]
    if (t >= a.t && t <= b.t) {
      const span = b.t - a.t
      const u = span <= 0 ? 0 : (t - a.t) / span
      const uEase = smoothstep01(u)
      const c = lerpHsl(hslAtAnchorIndex(i), hslAtAnchorIndex(i + 1), uEase)
      return hslToHex(c)
    }
  }
  return TEMP_ANCHORS[TEMP_ANCHORS.length - 1].hex
}

/** Color representativo entre dos temperaturas (segmento de histórico). */
export function getTemperatureStrokeSegment(t0: number, t1: number): string {
  const m = (Math.min(100, Math.max(0, t0)) + Math.min(100, Math.max(0, t1))) / 2
  return getTemperatureStroke(m)
}
