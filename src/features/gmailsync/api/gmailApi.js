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
