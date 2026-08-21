import { useMutation } from '@tanstack/react-query'
import apiClient from '../../../api/apiClient'

const ADVISOR_CHAT_ENDPOINT = '/advisor/chat'

/**
 * @typedef {Object} AdvisorReply
 * @property {string} reply
 * @property {string} timestamp
 */

/**
 * @param {string} message
 * @returns {Promise<AdvisorReply>}
 */
async function askAdvisor(message) {
  const { data } = await apiClient.post(ADVISOR_CHAT_ENDPOINT, { message })
  return data
}

export function useAskAdvisor() {
  return useMutation({
    mutationFn: askAdvisor,
  })
}

export default useAskAdvisor
