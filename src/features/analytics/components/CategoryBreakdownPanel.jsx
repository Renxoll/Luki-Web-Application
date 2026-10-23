import { useState } from 'react'
import { sequentialSteps, withAlpha } from '../../../lib/colorScale'
import { useFitCount } from '../../../lib/useFitCount'

// En modo compacto cada categoría es una fila de una línea: 40px de alto + 6px de separación.
const COMPACT_ROW_PITCH = 46

function formatCurrency(amount, currency = 'PEN') {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount ?? 0)
}

/**
 * Desglose de gasto por categoría. Un solo tono (el color del módulo activo), del más
 * oscuro (la categoría más grande) al más claro -- "más = más oscuro", la codificación que
 * la guía de dataviz recomienda para comparar magnitudes. Arriba, una barra apilada de
 * parte-sobre-el-total con separadores de 2px entre segmentos; abajo, las categorías
 * ordenadas con barra fina, extremo redondeado anclado a la izquierda y valor + % directos.
 */
export function CategoryBreakdownPanel({ items, currency, accentHex = '#8B5CF6', fit = false }) {
  const [hovered, setHovered] = useState(null)
  // Con `fit` el panel se reparte el alto que le deja la pantalla (en cualquier tamaño) y solo
  // pinta las categorías que entran; sin `fit` muestra todas y la página scrollea.
  const { ref, count: fitCount } = useFitCount({ itemHeight: COMPACT_ROW_PITCH, fallback: null, min: 0, max: 40, always: fit })
  const compact = fit

  if (!items || items.length === 0) {
    return (
      <div className="card p-6 text-center text-sm text-off-white/55">
        Aún no hay gastos categorizados este mes en este módulo.
      </div>
    )
  }

  const sorted = [...items].sort((a, b) => b.amount - a.amount)
  const steps = sequentialSteps(accentHex, sorted.length)
  const max = Math.max(...sorted.map((i) => i.amount), 1)
  const total = sorted.reduce((sum, i) => sum + (i.amount ?? 0), 0)

  // Las que no entran se resumen en una última fila "N categorías más" (con su monto) en vez
  // de obligar a scrollear.
  const overflowing = compact && fitCount != null && sorted.length > fitCount
  // Una fila del cupo se la lleva el resumen; si no entra ni una, no se pinta nada.
  const shownCount = overflowing ? Math.max(0, fitCount - 1) : sorted.length
  const visible = sorted.slice(0, shownCount)
  const hiddenItems = overflowing ? sorted.slice(shownCount) : []
  const hiddenTotal = hiddenItems.reduce((sum, i) => sum + (i.amount ?? 0), 0)

  return (
    <div className={compact ? 'flex h-full min-h-0 flex-col gap-2 sm:gap-3' : 'space-y-4'}>
      {/* Barra parte-sobre-el-total */}
      <div className={`card ${compact ? 'shrink-0 px-3 py-2.5 sm:px-4 sm:py-3' : 'p-4'}`}>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="section-title">Gasto del mes</span>
          <span className="text-sm font-semibold tabular-nums">{formatCurrency(total, currency)}</span>
        </div>
        <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-white/[0.05]">
          {sorted.map((item, i) => {
            const share = total > 0 ? (item.amount / total) * 100 : 0
            return (
              <div
                key={item.categoryId}
                title={`${item.categoryName} · ${formatCurrency(item.amount, currency)} (${item.percentage.toFixed(0)}%)`}
                onMouseEnter={() => setHovered(item.categoryId)}
                onMouseLeave={() => setHovered(null)}
                className="h-full first:rounded-l-full last:rounded-r-full transition-[filter]"
                style={{
                  width: `${Math.max(share, 1.5)}%`,
                  backgroundColor: steps[i],
                  filter: hovered && hovered !== item.categoryId ? 'saturate(0.5) opacity(0.55)' : undefined,
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Filas ordenadas. En escritorio esta zona recibe el alto que sobra (se mide) y cada
          categoría es una sola línea; en móvil, dos líneas y scroll natural de la página. */}
      <div ref={ref} className={compact ? 'min-h-0 flex-1 overflow-hidden' : undefined}>
        <ul className={compact ? 'space-y-1.5' : 'space-y-2'}>
          {visible.map((item, i) => {
            const isHovered = hovered === item.categoryId
            const bar = (
              <div className={`h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06] ${compact ? 'hidden sm:block' : ''}`}>
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{
                    width: `${Math.max(4, (item.amount / max) * 100)}%`,
                    backgroundColor: steps[i],
                    boxShadow: isHovered ? `0 0 0 1px ${withAlpha(steps[i], 0.5)}` : undefined,
                  }}
                />
              </div>
            )
            const percentage = (
              <span
                className="w-10 shrink-0 text-right text-xs tabular-nums"
                style={{ color: steps[Math.min(i, steps.length - 1)] }}
              >
                {item.percentage.toFixed(0)}%
              </span>
            )
            const name = (
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: steps[i] }} />
                <span className="truncate">{item.categoryName}</span>
              </span>
            )
            const amount = (
              <span className="shrink-0 text-sm font-semibold tabular-nums">{formatCurrency(item.amount, currency)}</span>
            )

            return (
              <li
                key={item.categoryId}
                onMouseEnter={() => setHovered(item.categoryId)}
                onMouseLeave={() => setHovered(null)}
                className={`card transition ${compact ? 'flex h-10 items-center gap-3 px-3' : 'p-3.5'} ${
                  isHovered ? 'border-white/15 bg-slate-800/70' : ''
                }`}
              >
                {compact ? (
                  <>
                    <span className="flex min-w-0 flex-1 sm:w-2/5 sm:flex-none sm:shrink-0">{name}</span>
                    {bar}
                    {percentage}
                    <span className="w-24 shrink-0 text-right">{amount}</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      {name}
                      {amount}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {bar}
                      {percentage}
                    </div>
                  </>
                )}
              </li>
            )
          })}

          {hiddenItems.length > 0 && (
            <li className="card flex h-10 items-center justify-between gap-3 px-3 text-sm text-off-white/55">
              <span>
                {hiddenItems.length} categoría{hiddenItems.length > 1 ? 's' : ''} más
              </span>
              <span className="font-semibold tabular-nums">{formatCurrency(hiddenTotal, currency)}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default CategoryBreakdownPanel
