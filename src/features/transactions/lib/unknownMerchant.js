/** El LLM devuelve "Desconocido" cuando no identifica el comercio; sin comercio es lo mismo. */
export function isUnknownMerchant(merchant) {
  const name = merchant?.trim()
  return !name || /^desconocido$/i.test(name)
}

/**
 * ¿Se le ofrece al usuario poner a mano en qué gastó? Sí cuando Luki no pudo leer el correo
 * (FAILED) o lo leyó sin comercio -- nunca para un ingreso ni una transferencia propia.
 */
export function needsManualDetails(transaction) {
  if (transaction.internalTransfer) return false
  if (transaction.status === 'FAILED') return true
  return transaction.status === 'PROCESSED' && transaction.type !== 'INCOME' && isUnknownMerchant(transaction.merchant)
}
