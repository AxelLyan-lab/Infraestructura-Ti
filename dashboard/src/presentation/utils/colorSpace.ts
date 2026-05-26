export type Hsl = { h: number; s: number; l: number }

/** RGB 0–255 → HSL (h 0–360, s/l 0–1) */
export function rgbToHsl(r: number, g: number, b: number): Hsl {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  let h = 0
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))

  if (d !== 0) {
    switch (max) {
      case rn:
        h = 60 * (((gn - bn) / d) % 6)
        break
      case gn:
        h = 60 * ((bn - rn) / d + 2)
        break
      default:
        h = 60 * ((rn - gn) / d + 4)
    }
  }
  if (h < 0) h += 360
  return { h, s, l }
}

export function hslToRgb({ h, s, l }: Hsl): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let rp = 0
  let gp = 0
  let bp = 0
  if (h < 60) {
    rp = c
    gp = x
  } else if (h < 120) {
    rp = x
    gp = c
  } else if (h < 180) {
    gp = c
    bp = x
  } else if (h < 240) {
    gp = x
    bp = c
  } else if (h < 300) {
    rp = x
    bp = c
  } else {
    rp = c
    bp = x
  }
  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '')
  const n = Number.parseInt(h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHex(r: number, g: number, b: number): string {
  const q = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return `#${q(r)}${q(g)}${q(b)}`
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** Interpolación de matiz por el arco más corto (0–360). */
export function lerpHsl(a: Hsl, b: Hsl, t: number): Hsl {
  let { h: h1 } = a
  const { h: h2 } = b
  let dh = h2 - h1
  if (dh > 180) dh -= 360
  if (dh < -180) dh += 360
  h1 += dh * t
  if (h1 < 0) h1 += 360
  if (h1 >= 360) h1 -= 360
  return {
    h: h1,
    s: lerp(a.s, b.s, t),
    l: lerp(a.l, b.l, t),
  }
}

/** Suaviza transiciones en los bordes de tramo (ease-in-out cúbico). */
export function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

export function hexToHsl(hex: string): Hsl {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHsl(r, g, b)
}

export function hslToHex(hsl: Hsl): string {
  const { r, g, b } = hslToRgb(hsl)
  return rgbToHex(r, g, b)
}
