import apiClient from '../../../api/apiClient'

const WORKSPACES_ENDPOINT = '/workspaces'

/**
 * @typedef {Object} WorkspaceCategory
 * @property {string} id
 * @property {string} code
 * @property {string} displayName
 * @property {string} icon
 * @property {number} position
 * @property {boolean} archived
 */

/**
 * @typedef {Object} Workspace
 * @property {string} id
 * @property {string} name
 * @property {string} colorHex
 * @property {string} icon
 * @property {boolean} isDefault
 * @property {string} createdAt
 * @property {WorkspaceCategory[]} categories
 */

/** @returns {Promise<Workspace[]>} */
export async function fetchWorkspaces() {
  const { data } = await apiClient.get(WORKSPACES_ENDPOINT)
  return data
}

/** @param {{name: string, colorHex?: string, icon?: string}} payload @returns {Promise<Workspace>} */
export async function createWorkspace(payload) {
  const { data } = await apiClient.post(WORKSPACES_ENDPOINT, payload)
  return data
}

/** @param {string} id @param {{name?: string, colorHex?: string, icon?: string}} payload @returns {Promise<Workspace>} */
export async function updateWorkspace(id, payload) {
  const { data } = await apiClient.patch(`${WORKSPACES_ENDPOINT}/${id}`, payload)
  return data
}

/** @param {string} id */
export async function archiveWorkspace(id) {
  await apiClient.delete(`${WORKSPACES_ENDPOINT}/${id}`)
}

/** @param {string} id @param {{displayName: string, icon?: string}} payload @returns {Promise<Workspace>} */
export async function addWorkspaceCategory(id, payload) {
  const { data } = await apiClient.post(`${WORKSPACES_ENDPOINT}/${id}/categories`, payload)
  return data
}

/**
 * @param {string} id
 * @param {string} categoryId
 * @param {{displayName: string, icon?: string}} payload
 * @returns {Promise<Workspace>}
 */
export async function updateWorkspaceCategory(id, categoryId, payload) {
  const { data } = await apiClient.patch(`${WORKSPACES_ENDPOINT}/${id}/categories/${categoryId}`, payload)
  return data
}

/** @param {string} id @param {string} categoryId @returns {Promise<Workspace>} */
export async function archiveWorkspaceCategory(id, categoryId) {
  const { data } = await apiClient.delete(`${WORKSPACES_ENDPOINT}/${id}/categories/${categoryId}`)
  return data
}
