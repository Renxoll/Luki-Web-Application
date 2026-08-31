import { useCategories } from '../api/useCategories'

export function CategorySelect({ value, onChange, disabled }) {
  const { data: categories, isLoading } = useCategories()

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || isLoading}
      className="shrink-0 rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1.5 text-xs text-off-white/80 outline-none transition focus:border-neon-purple/50 focus:ring-2 focus:ring-neon-purple/30 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {(categories ?? []).map((category) => (
        <option key={category.code} value={category.code} className="bg-midnight text-off-white">
          {category.icon ? `${category.icon} ` : ''}
          {category.displayName}
        </option>
      ))}
    </select>
  )
}

export default CategorySelect
