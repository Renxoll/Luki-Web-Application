import { useCategories } from '../api/useCategories'

export function CategorySelect({ value, onChange, disabled }) {
  const { data: categories, isLoading } = useCategories()

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || isLoading}
      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-off-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {(categories ?? []).map((category) => (
        <option key={category.code} value={category.code} className="bg-midnight">
          {category.icon ? `${category.icon} ` : ''}
          {category.displayName}
        </option>
      ))}
    </select>
  )
}

export default CategorySelect
