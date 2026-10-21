/**
 * Mensaje de error para una mutación de módulos. Los 409 del backend (módulo General
 * protegido, categoría duplicada, última categoría activa) traen un `message` en español
 * que explica el motivo, así que se muestra tal cual; el resto cae al texto genérico.
 */
export function workspaceErrorMessage(error, fallback) {
  const data = error?.response?.data
  if (error?.response?.status === 409 && typeof data?.message === 'string' && data.message.trim()) {
    return data.message
  }
  return fallback
}
