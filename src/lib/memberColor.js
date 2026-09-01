// Mismo criterio que category.js: un color de avatar estable por persona, sin depender de
// que el backend mande nada -- el mismo nombre siempre cae en el mismo color.
const PALETTE = [
  { bg: 'bg-violet-400/20', text: 'text-violet-200' },
  { bg: 'bg-emerald-400/20', text: 'text-emerald-200' },
  { bg: 'bg-sky-400/20', text: 'text-sky-200' },
  { bg: 'bg-amber-400/20', text: 'text-amber-200' },
  { bg: 'bg-rose-400/20', text: 'text-rose-200' },
  { bg: 'bg-cyan-400/20', text: 'text-cyan-200' },
  { bg: 'bg-fuchsia-400/20', text: 'text-fuchsia-200' },
  { bg: 'bg-lime-400/20', text: 'text-lime-200' },
]

export function memberColor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

export function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
