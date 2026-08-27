import apiClient from '../../../api/apiClient'

const PENDING_SENDERS_ENDPOINT = '/pending-senders'

/**
 * @typedef {Object} PendingSender
 * @property {string} pendingSenderId
 * @property {string} fromAddress
 * @property {string} domain
 * @property {string} sampleSnippet
 * @property {number} occurrenceCount
 * @property {string} firstSeenAt
 * @property {string} lastSeenAt
 */

/** @returns {Promise<PendingSender[]>} */
export async function fetchPendingSenders() {
  const { data } = await apiClient.get(PENDING_SENDERS_ENDPOINT)
  return data
}

/** @param {string} pendingSenderId */
export async function approvePendingSender(pendingSenderId) {
  await apiClient.post(`${PENDING_SENDERS_ENDPOINT}/${pendingSenderId}/approve`)
}

/** @param {string} pendingSenderId */
export async function rejectPendingSender(pendingSenderId) {
  await apiClient.post(`${PENDING_SENDERS_ENDPOINT}/${pendingSenderId}/reject`)
}
