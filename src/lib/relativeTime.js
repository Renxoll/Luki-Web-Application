const dateFormatter = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })

export function formatShortDate(value) {
  return value ? dateFormatter.format(new Date(value)) : null
}

/** "hace 3 min" / "ayer" / fecha corta para fechas lejanas. `null` si no hay valor. */
export function formatRelativeTime(value) {
  if (!value) return null
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000)
  if (minutes < 1) return 'hace un momento'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  if (days === 1) return 'ayer'
  if (days < 30) return `hace ${days} días`
  return formatShortDate(value)
}
