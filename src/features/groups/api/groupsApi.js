import apiClient from '../../../api/apiClient'

const GROUPS_ENDPOINT = '/groups'

/**
 * @typedef {Object} CurrencyBalance
 * @property {string} currency
 * @property {number} amount
 */

/**
 * @typedef {Object} GroupSummary
 * @property {string} groupId
 * @property {string} name
 * @property {number} memberCount
 * @property {CurrencyBalance[]} yourBalances
 */

/** @returns {Promise<GroupSummary[]>} */
export async function fetchMyGroups() {
  const { data } = await apiClient.get(GROUPS_ENDPOINT)
  return data
}

/** @param {string} name @returns {Promise<{groupId: string, name: string}>} */
export async function createGroup(name) {
  const { data } = await apiClient.post(GROUPS_ENDPOINT, { name })
  return data
}

/**
 * @typedef {Object} GroupDeletion
 * @property {string} requestedBy
 * @property {string} requestedByDisplayName
 * @property {string} requestedAt
 * @property {string[]} approvedByUserIds
 * @property {string[]} pendingApprovalFrom
 */

/**
 * Detalle del grupo. Además de members/expenses/settlements/simplifiedDebts trae:
 * - `expenses[].updatedAt`: fecha de la última corrección del gasto, o null si nunca se editó.
 * - `deletionRequest`: {@link GroupDeletion} si hay una solicitud de borrado abierta, o null.
 *
 * @param {string} groupId
 */
export async function fetchGroupDetail(groupId) {
  const { data } = await apiClient.get(`${GROUPS_ENDPOINT}/${groupId}`)
  return data
}

/** @param {string} groupId @param {string} email */
export async function inviteMember(groupId, email) {
  const { data } = await apiClient.post(`${GROUPS_ENDPOINT}/${groupId}/invites`, { email })
  return data
}

/** @param {{groupId: string, description: string, amount: number, currency: string, paidByUserId: string, participantUserIds: string[]}} params */
export async function addExpense({ groupId, description, amount, currency, paidByUserId, participantUserIds }) {
  const { data } = await apiClient.post(`${GROUPS_ENDPOINT}/${groupId}/expenses`, {
    description,
    amount,
    currency,
    paidByUserId,
    participantUserIds,
  })
  return data
}

/**
 * Corrige un gasto ya registrado (typo en la descripción, monto mal tipeado, pagador o
 * participantes equivocados). Solo lo permite quien pagó el gasto o el owner del grupo (403
 * si no). Los shares se recalculan de cero en el backend.
 *
 * @param {{groupId: string, expenseId: string, description: string, amount: number, currency: string, paidByUserId: string, participantUserIds: string[]}} params
 */
export async function editExpense({ groupId, expenseId, description, amount, currency, paidByUserId, participantUserIds }) {
  await apiClient.put(`${GROUPS_ENDPOINT}/${groupId}/expenses/${expenseId}`, {
    description,
    amount,
    currency,
    paidByUserId,
    participantUserIds,
  })
}

/** @param {{groupId: string, toUserId: string, amount: number, currency: string}} params */
export async function recordSettlement({ groupId, toUserId, amount, currency }) {
  const { data } = await apiClient.post(`${GROUPS_ENDPOINT}/${groupId}/settlements`, { toUserId, amount, currency })
  return data
}

/**
 * Borrado del grupo por consenso. `request` abre la solicitud (y cuenta como tu aprobación),
 * `approve` suma tu voto — cuando aprueban todos los miembros aceptados el backend borra el
 * grupo y sus datos (409 si hay saldos pendientes) —, `cancel` retira la solicitud.
 * El estado de la solicitud PENDING llega en `fetchGroupDetail(...).deletionRequest`.
 */
export async function requestGroupDeletion(groupId) {
  await apiClient.post(`${GROUPS_ENDPOINT}/${groupId}/deletion-request`)
}

/** @param {string} groupId */
export async function approveGroupDeletion(groupId) {
  await apiClient.post(`${GROUPS_ENDPOINT}/${groupId}/deletion-request/approve`)
}

/** @param {string} groupId */
export async function cancelGroupDeletion(groupId) {
  await apiClient.delete(`${GROUPS_ENDPOINT}/${groupId}/deletion-request`)
}

/** @returns {Promise<Array<{membershipId: string, groupId: string, groupName: string, invitedAt: string}>>} */
export async function fetchMyPendingInvites() {
  const { data } = await apiClient.get(`${GROUPS_ENDPOINT}/invites`)
  return data
}

/** @param {string} membershipId */
export async function acceptInvite(membershipId) {
  await apiClient.post(`${GROUPS_ENDPOINT}/invites/${membershipId}/accept`)
}

/** @param {string} membershipId */
export async function declineInvite(membershipId) {
  await apiClient.post(`${GROUPS_ENDPOINT}/invites/${membershipId}/decline`)
}
