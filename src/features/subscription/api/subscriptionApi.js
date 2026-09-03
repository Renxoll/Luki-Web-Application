import apiClient from '../../../api/apiClient'

const SUBSCRIPTIONS_ENDPOINT = '/subscriptions'

/**
 * @typedef {Object} Subscription
 * @property {string} planCode   'FREE' | 'PREMIUM'
 * @property {string} status     'ACTIVE' | 'CANCELED' | 'EXPIRED'
 * @property {string} startedAt
 * @property {string|null} renewsAt
 * @property {string|null} canceledAt
 */

/** La suscripción activa del usuario, o `null` si no tiene ninguna (404 del backend). */
export async function fetchActiveSubscription() {
  try {
    const { data } = await apiClient.get(`${SUBSCRIPTIONS_ENDPOINT}/active`)
    return data
  } catch (error) {
    if (error.response?.status === 404) return null
    throw error
  }
}

/**
 * Inicia el alta de un plan. FREE se activa de una (201, devuelve la suscripción). PREMIUM
 * devuelve `{ checkoutUrl }` (200) -- hay que redirigir el navegador ahí.
 * @param {'FREE'|'PREMIUM'} planCode
 * @returns {Promise<{ checkoutUrl?: string, planCode?: string }>}
 */
export async function startCheckout(planCode) {
  const { data } = await apiClient.post(`${SUBSCRIPTIONS_ENDPOINT}/checkout`, { planCode })
  return data
}

export async function cancelSubscription() {
  await apiClient.delete(`${SUBSCRIPTIONS_ENDPOINT}/active`)
}
