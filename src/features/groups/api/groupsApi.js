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

/** @param {string} groupId */
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

/** @param {{groupId: string, toUserId: string, amount: number, currency: string}} params */
export async function recordSettlement({ groupId, toUserId, amount, currency }) {
  const { data } = await apiClient.post(`${GROUPS_ENDPOINT}/${groupId}/settlements`, { toUserId, amount, currency })
  return data
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
