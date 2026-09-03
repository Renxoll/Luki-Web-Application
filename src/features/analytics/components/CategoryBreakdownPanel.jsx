import { useState } from 'react'
import { sequentialSteps, withAlpha } from '../../../lib/colorScale'

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
export function CategoryBreakdownPanel({ items, currency, accentHex = '#8B5CF6' }) {
  const [hovered, setHovered] = useState(null)

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

  return (
    <div className="space-y-4">
      {/* Barra parte-sobre-el-total */}
      <div className="card p-4">
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

      {/* Filas ordenadas */}
      <ul className="space-y-2">
        {sorted.map((item, i) => {
          const isHovered = hovered === item.categoryId
          return (
            <li
              key={item.categoryId}
              onMouseEnter={() => setHovered(item.categoryId)}
              onMouseLeave={() => setHovered(null)}
              className={`card p-3.5 transition ${isHovered ? 'border-white/15 bg-slate-800/70' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: steps[i] }}
                  />
                  <span className="truncate">{item.categoryName}</span>
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatCurrency(item.amount, currency)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-[width]"
                    style={{
                      width: `${Math.max(4, (item.amount / max) * 100)}%`,
                      backgroundColor: steps[i],
                      boxShadow: isHovered ? `0 0 0 1px ${withAlpha(steps[i], 0.5)}` : undefined,
                    }}
                  />
                </div>
                <span
                  className="w-10 shrink-0 text-right text-xs tabular-nums"
                  style={{ color: steps[Math.min(i, steps.length - 1)] }}
                >
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CategoryBreakdownPanel
