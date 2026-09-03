// Utilidades de color para los gráficos: a partir del color de un módulo se derivan
// escalones secuenciales (mismo tono, de oscuro a claro) para el desglose por categoría.
// Un solo tono, "más = más oscuro" -- es la codificación difícil de malinterpretar y la
// que recomienda la guía de dataviz para comparar magnitudes.

export function hexToHsl(hex) {
  let clean = String(hex || '').replace('#', '').trim()
  if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('')
  if (clean.length !== 6) return { h: 258, s: 90, l: 66 } // fallback = neon-purple
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  return { h, s: s * 100, l: l * 100 }
}

export function hslToHex({ h, s, l }) {
  const sN = s / 100
  const lN = l / 100
  const c = (1 - Math.abs(2 * lN - 1)) * sN
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lN - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * `n` escalones del mismo tono que `baseHex`, del más oscuro (rango 0, el gasto más grande)
 * al más claro. La banda de luminosidad se mantiene legible sobre el fondo oscuro de la app.
 */
export function sequentialSteps(baseHex, n) {
  if (n <= 0) return []
  const { h, s } = hexToHsl(baseHex)
  const sat = Math.max(45, Math.min(s, 82))
  const lo = 42
  const hi = 74
  return Array.from({ length: n }, (_, i) => {
    const l = n === 1 ? 58 : lo + ((hi - lo) * i) / (n - 1)
    return hslToHex({ h, s: sat, l })
  })
}

/** `#rrggbb` + alpha (0-1) -> `rgba(...)`. */
export function withAlpha(hex, alpha) {
  let clean = String(hex || '').replace('#', '').trim()
  if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('')
  if (clean.length !== 6) return `rgba(139, 92, 246, ${alpha})`
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
