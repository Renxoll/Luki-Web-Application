import { useCategories } from '../api/useCategories'

/**
 * Selector de categoría. Si se le pasa `options` (categorías de un módulo custom) usa esas;
 * si no, cae al catálogo global de gastos personales.
 */
export function CategorySelect({ value, onChange, disabled, options }) {
  const { data: fallback, isLoading } = useCategories()
  const categories = options ?? fallback ?? []

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || (!options && isLoading)}
      className="w-28 max-w-[35vw] shrink-0 truncate rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1.5 text-xs text-off-white/80 outline-none transition focus:border-neon-purple/50 focus:ring-2 focus:ring-neon-purple/30 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {categories.map((category) => (
        <option key={category.code} value={category.code} className="bg-midnight text-off-white">
          {category.displayName}
        </option>
      ))}
    </select>
  )
}

export default CategorySelect
