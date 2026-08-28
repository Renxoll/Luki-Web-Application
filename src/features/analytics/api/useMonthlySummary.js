import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'

const MONTHLY_SUMMARY_ENDPOINT = '/analytics/monthly-summary'

/**
 * @typedef {Object} CategoryBreakdown
 * @property {number} categoryId
 * @property {string} categoryName
 * @property {number} amount
 * @property {number} percentage
 */

/**
 * @typedef {Object} MonthlySummary
 * @property {number} totalSpent
 * @property {number} previousMonthTotal
 * @property {number} totalIncome
 * @property {CategoryBreakdown[]} breakdown
 */

/** @returns {Promise<MonthlySummary>} */
async function fetchMonthlySummary() {
  const { data } = await apiClient.get(MONTHLY_SUMMARY_ENDPOINT)
  return data
}

export function useMonthlySummary() {
  return useQuery({
    queryKey: ['analytics', 'monthly-summary'],
    queryFn: fetchMonthlySummary,
    staleTime: 5 * 60 * 1000,
  })
}

export default useMonthlySummary
