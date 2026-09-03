import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'

const MONTHLY_SUMMARY_ENDPOINT = '/analytics/monthly-summary'

/**
 * @typedef {Object} CategoryBreakdown
 * @property {string} categoryId
 * @property {string} categoryName
 * @property {number} amount
 * @property {number} percentage
 */

/**
 * @typedef {Object} CurrencySummary
 * @property {string} currency
 * @property {number} totalSpent
 * @property {number} previousMonthTotal
 * @property {number} totalIncome
 * @property {CategoryBreakdown[]} breakdown
 */

/**
 * @typedef {Object} MonthlySummary
 * @property {CurrencySummary[]} currencies
 */

/** @param {string|null} workspaceId @returns {Promise<MonthlySummary>} */
async function fetchMonthlySummary(workspaceId) {
  const { data } = await apiClient.get(MONTHLY_SUMMARY_ENDPOINT, {
    params: workspaceId ? { workspaceId } : undefined,
  })
  return data
}

/** `workspaceId` null = módulo General (el backend lo asume por defecto). */
export function useMonthlySummary(workspaceId = null) {
  return useQuery({
    queryKey: ['analytics', 'monthly-summary', workspaceId ?? 'general'],
    queryFn: () => fetchMonthlySummary(workspaceId),
    staleTime: 5 * 60 * 1000,
  })
}

export default useMonthlySummary
