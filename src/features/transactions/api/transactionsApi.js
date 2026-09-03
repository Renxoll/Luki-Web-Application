import apiClient from '../../../api/apiClient'

const TRANSACTIONS_ENDPOINT = '/transactions'
const CATEGORIES_ENDPOINT = '/transactions/categories'

/**
 * @typedef {Object} Transaction
 * @property {string} transactionId
 * @property {string} status
 * @property {number} amount
 * @property {string} currency
 * @property {string} merchant
 * @property {string} categoryCode
 * @property {string} category
 * @property {'EXPENSE'|'INCOME'} type
 * @property {boolean} internalTransfer  transferencia entre cuentas propias (no cuenta en el resumen)
 * @property {string} createdAt
 * @property {string} workspaceId  módulo al que pertenece la transacción
 */

/**
 * @typedef {Object} TransactionPage
 * @property {Transaction[]} items
 * @property {number} page
 * @property {number} size
 * @property {number} totalElements
 */

/**
 * @param {{page?: number, size?: number, workspaceId?: string|null}} params
 * @returns {Promise<TransactionPage>}
 */
export async function fetchTransactions({ page = 0, size = 20, workspaceId = null } = {}) {
  const params = { page, size }
  if (workspaceId) params.workspaceId = workspaceId
  const { data } = await apiClient.get(TRANSACTIONS_ENDPOINT, { params })
  return data
}

/** @typedef {Object} Category
 * @property {string} code
 * @property {string} displayName
 * @property {string} icon
 */

/** @returns {Promise<Category[]>} */
export async function fetchCategories() {
  const { data } = await apiClient.get(CATEGORIES_ENDPOINT)
  return data
}

/**
 * @param {string} transactionId
 * @param {string} categoryCode
 * @returns {Promise<Transaction>}
 */
export async function updateTransactionCategory(transactionId, categoryCode) {
  const { data } = await apiClient.patch(`${TRANSACTIONS_ENDPOINT}/${transactionId}/category`, { categoryCode })
  return data
}

/**
 * Mueve la transacción a otro módulo. Para un gasto, `categoryCode` es obligatorio y debe
 * ser una categoría válida del módulo destino.
 * @param {string} transactionId
 * @param {{workspaceId: string, categoryCode?: string}} payload
 * @returns {Promise<Transaction>}
 */
export async function moveTransactionToWorkspace(transactionId, payload) {
  const { data } = await apiClient.patch(`${TRANSACTIONS_ENDPOINT}/${transactionId}/workspace`, payload)
  return data
}

/**
 * Marca o desmarca una transacción como movimiento entre las cuentas propias del usuario
 * (no cuenta como gasto ni ingreso en el resumen).
 * @param {string} transactionId
 * @param {boolean} internalTransfer
 * @returns {Promise<Transaction>}
 */
export async function setInternalTransfer(transactionId, internalTransfer) {
  const { data } = await apiClient.patch(
    `${TRANSACTIONS_ENDPOINT}/${transactionId}/internal-transfer`,
    { internalTransfer },
  )
  return data
}

/**
 * @param {{amount: number, currency: string, source: string, workspaceId?: string|null}} params
 * @returns {Promise<Transaction>}
 */
export async function recordManualIncome({ amount, currency, source, workspaceId = null }) {
  const body = { amount, currency, source }
  if (workspaceId) body.workspaceId = workspaceId
  const { data } = await apiClient.post(`${TRANSACTIONS_ENDPOINT}/income`, body)
  return data
}
