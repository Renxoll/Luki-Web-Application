import { beforeEach, describe, expect, it, vi } from 'vitest'
import apiClient from '../../../api/apiClient'
import { cancelSubscription, confirmCheckout, fetchActiveSubscription, startCheckout } from './subscriptionApi'

vi.mock('../../../api/apiClient', () => ({
  default: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}))

const PREMIUM = { planCode: 'PREMIUM', status: 'ACTIVE', startedAt: '2026-10-01T00:00:00Z', renewsAt: '2026-10-31T00:00:00Z' }

function httpError(status) {
  return Object.assign(new Error(`HTTP ${status}`), { response: { status } })
}

describe('subscriptionApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchActiveSubscription', () => {
    it('devuelve la suscripción activa', async () => {
      apiClient.get.mockResolvedValue({ data: PREMIUM })

      await expect(fetchActiveSubscription()).resolves.toEqual(PREMIUM)
      expect(apiClient.get).toHaveBeenCalledWith('/subscriptions/active')
    })

    it('devuelve null cuando el backend responde 404 (sin plan)', async () => {
      apiClient.get.mockRejectedValue(httpError(404))

      await expect(fetchActiveSubscription()).resolves.toBeNull()
    })

    it('propaga cualquier otro error', async () => {
      apiClient.get.mockRejectedValue(httpError(500))

      await expect(fetchActiveSubscription()).rejects.toMatchObject({ response: { status: 500 } })
    })
  })

  it('startCheckout envía el plan elegido y devuelve la URL de Stripe', async () => {
    apiClient.post.mockResolvedValue({ data: { checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_1' } })

    await expect(startCheckout('PREMIUM')).resolves.toEqual({ checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_1' })
    expect(apiClient.post).toHaveBeenCalledWith('/subscriptions/checkout', { planCode: 'PREMIUM' })
  })

  it('confirmCheckout envía el session_id de Stripe y devuelve la suscripción activada', async () => {
    apiClient.post.mockResolvedValue({ data: PREMIUM })

    await expect(confirmCheckout('cs_test_1')).resolves.toEqual(PREMIUM)
    expect(apiClient.post).toHaveBeenCalledWith('/subscriptions/checkout/confirm', { sessionId: 'cs_test_1' })
  })

  it('cancelSubscription borra la suscripción activa', async () => {
    apiClient.delete.mockResolvedValue({})

    await cancelSubscription()

    expect(apiClient.delete).toHaveBeenCalledWith('/subscriptions/active')
  })
})
