// Paleta estable para las categorías: el mismo nombre siempre cae en el mismo color,
// sin necesidad de que el backend mande un color. Tonos elegidos para contrastar sobre
// el fondo oscuro sin competir entre sí.
const PALETTE = [
  { text: 'text-violet-300', bar: 'bg-violet-400', soft: 'bg-violet-400/15', ring: 'ring-violet-400/30' },
  { text: 'text-emerald-300', bar: 'bg-emerald-400', soft: 'bg-emerald-400/15', ring: 'ring-emerald-400/30' },
  { text: 'text-sky-300', bar: 'bg-sky-400', soft: 'bg-sky-400/15', ring: 'ring-sky-400/30' },
  { text: 'text-amber-300', bar: 'bg-amber-400', soft: 'bg-amber-400/15', ring: 'ring-amber-400/30' },
  { text: 'text-rose-300', bar: 'bg-rose-400', soft: 'bg-rose-400/15', ring: 'ring-rose-400/30' },
  { text: 'text-cyan-300', bar: 'bg-cyan-400', soft: 'bg-cyan-400/15', ring: 'ring-cyan-400/30' },
  { text: 'text-fuchsia-300', bar: 'bg-fuchsia-400', soft: 'bg-fuchsia-400/15', ring: 'ring-fuchsia-400/30' },
  { text: 'text-lime-300', bar: 'bg-lime-400', soft: 'bg-lime-400/15', ring: 'ring-lime-400/30' },
]

export function categoryColor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}
