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
 * @property {string} createdAt
 */

/**
 * @typedef {Object} TransactionPage
 * @property {Transaction[]} items
 * @property {number} page
 * @property {number} size
 * @property {number} totalElements
 */

/**
 * @param {{page?: number, size?: number}} params
 * @returns {Promise<TransactionPage>}
 */
export async function fetchTransactions({ page = 0, size = 20 } = {}) {
  const { data } = await apiClient.get(TRANSACTIONS_ENDPOINT, { params: { page, size } })
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
