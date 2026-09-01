// A diferencia del resto de la app (que siempre formatea en PEN, ver TransactionRow.jsx),
// acá la moneda viene por dato -- Money soporta cualquier código ISO 4217 del lado del
// backend (ver groups.domain.model.valueobjects.Money) -- así que el formatter se arma por
// llamada en vez de ser una constante de módulo fija a 'PEN'.
export function formatMoney(amount, currency) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount)
}
