import { FieldHelp } from './FieldHelp'

/**
 * Rótulo de un campo junto a su ayuda electrónica (ⓘ). `help` es la clave del catálogo
 * `lib/fieldHelp.js`. Con `id` se enlaza al control (`htmlFor`); sin él (grupos de checkboxes,
 * selector de color o de ícono) se pinta como texto, sin `<label>`.
 */
export function FieldLabel({ id, label, help, className = 'mb-1.5' }) {
  const Tag = id ? 'label' : 'span'
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Tag {...(id ? { htmlFor: id } : {})} className="text-xs font-medium text-off-white/55">
        {label}
      </Tag>
      {help && <FieldHelp helpKey={help} label={label} />}
    </div>
  )
}

/** Campo completo: rótulo con ayuda + el control (`children`). */
export function Field({ id, label, help, className = '', children }) {
  return (
    <div className={className}>
      <FieldLabel id={id} label={label} help={help} />
      {children}
    </div>
  )
}

export default Field
