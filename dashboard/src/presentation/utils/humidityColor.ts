import { hexToHsl, hslToHex, lerpHsl, smoothstep01 } from './colorSpace'

/**
 * Anclas de color en % HR (eje 0–100).
 * Por debajo de 25: blanco; 25–40 celeste claro; 40–60 celeste más marcado; 60–80 transición a azul; desde el 86 %
 * el tono se congela en el mismo azul que en el 86 % (el 100 % ya no oscurece más).
 * En tema oscuro el tramo bajo sustituye blanco por gris muy claro para que se vea sobre el fondo.
 */
const HUM_ANCHORS_LIGHT: Array<{ h: number; hex: string }> = [
  { h: 0, hex: '#ffffff' },
  { h: 22, hex: '#ffffff' },
  { h: 25, hex: '#e0f2fe' },
  { h: 32, hex: '#bae6fd' },
  { h: 40, hex: '#7dd3fc' },
  { h: 50, hex: '#38bdf8' },
  { h: 60, hex: '#0ea5e9' },
  { h: 70, hex: '#3b82f6' },
  { h: 80, hex: '#2563eb' },
  { h: 92, hex: '#1d4ed8' },
  { h: 100, hex: '#1e3a8a' },
]

const HUM_ANCHORS_DARK: Array<{ h: number; hex: string }> = [
  { h: 0, hex: '#e2e8f0' },
  { h: 22, hex: '#e2e8f0' },
  { h: 25, hex: '#bae6fd' },
  { h: 32, hex: '#7dd3fc' },
  { h: 40, hex: '#38bdf8' },
  { h: 50, hex: '#22d3ee' },
  { h: 60, hex: '#0ea5e9' },
  { h: 70, hex: '#3b82f6' },
  { h: 80, hex: '#2563eb' },
  { h: 92, hex: '#1d4ed8' },
  { h: 100, hex: '#1e3a8a' },
]

function hslAt(anchors: typeof HUM_ANCHORS_LIGHT, i: number) {
  return hexToHsl(anchors[i].hex)
}

function strokeAtHumidity(pct: number, anchors: typeof HUM_ANCHORS_LIGHT): string {
  const h = Math.min(100, Math.max(0, pct))
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i]
    const b = anchors[i + 1]
    if (h >= a.h && h <= b.h) {
      const span = b.h - a.h
      const u = span <= 0 ? 0 : (h - a.h) / span
      const uEase = smoothstep01(u)
      const c = lerpHsl(hslAt(anchors, i), hslAt(anchors, i + 1), uEase)
      return hslToHex(c)
    }
  }
  return anchors[anchors.length - 1].hex
}

export function getHumidityStroke(humPct: number, isDark: boolean): string {
  const anchors = isDark ? HUM_ANCHORS_DARK : HUM_ANCHORS_LIGHT
  const h = Math.min(100, Math.max(0, humPct))
  /** A partir del 86 % el color se mantuvo igual al 86 % (el 100 % quedaba demasiado apagado). */
  const hForStroke = h >= 86 ? 86 : h
  return strokeAtHumidity(hForStroke, anchors)
}

export function getHumidityStrokeSegment(h0: number, h1: number, isDark: boolean): string {
  const m = (Math.min(100, Math.max(0, h0)) + Math.min(100, Math.max(0, h1))) / 2
  return getHumidityStroke(m, isDark)
}
