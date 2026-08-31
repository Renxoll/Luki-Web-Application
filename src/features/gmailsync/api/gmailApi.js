import apiClient from '../../../api/apiClient'

const CONNECTIONS_ENDPOINT = '/gmail/connections'

/**
 * @typedef {Object} GmailConnection
 * @property {string} id
 * @property {string|null} email
 * @property {string} connectedAt
 * @property {string|null} lastSyncedAt
 */

/** @returns {Promise<GmailConnection[]>} */
export async function fetchGmailConnections() {
  const { data } = await apiClient.get(CONNECTIONS_ENDPOINT)
  return data
}

/** @param {string} connectionId */
export async function disconnectGmailConnection(connectionId) {
  await apiClient.delete(`${CONNECTIONS_ENDPOINT}/${connectionId}`)
}

/**
 * @typedef {Object} GmailSyncResult
 * @property {number} connectionsSynced
 * @property {number} transactionsIngested   gastos nuevos que ya entraron a categorización
 * @property {number} pendingSendersRegistered  correos de remitentes que faltan aprobar
 * @property {string} syncedAt
 */

/**
 * Fuerza la lectura de la bandeja ahora (mismo trabajo que el job programado, acotado al
 * usuario autenticado). Puede tardar unos segundos: hace llamadas reales a la API de Gmail.
 * @returns {Promise<GmailSyncResult>}
 */
export async function syncGmailConnections() {
  const { data } = await apiClient.post(`${CONNECTIONS_ENDPOINT}/sync`)
  return data
}
