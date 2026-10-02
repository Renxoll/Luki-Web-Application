import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { confirmCheckout } from '../api/subscriptionApi'
import { CONFIRM_MAX_RETRIES } from '../api/useSubscription'
import { CheckoutResult } from './CheckoutResult'

vi.mock('../api/subscriptionApi', () => ({
  confirmCheckout: vi.fn(),
  fetchActiveSubscription: vi.fn().mockResolvedValue(null),
}))

const PREMIUM = { planCode: 'PREMIUM', status: 'ACTIVE', startedAt: '2026-10-01T00:00:00Z', renewsAt: '2026-10-31T00:00:00Z' }

function httpError(status) {
  return Object.assign(new Error(`HTTP ${status}`), { response: { status } })
}

function renderReturnFromStripe(url, outcome = 'success') {
  return renderWithProviders(<CheckoutResult outcome={outcome} />, { path: `/subscription/${outcome}`, url })
}

describe('CheckoutResult (vuelta de Stripe Checkout)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('confirma la sesión de Stripe y muestra Premium activo', async () => {
    confirmCheckout.mockResolvedValue(PREMIUM)

    const { queryClient } = renderReturnFromStripe('/subscription/success?session_id=cs_test_1')

    expect(screen.getByText('Confirmando tu pago…')).toBeInTheDocument()
    expect(await screen.findByText('¡Bienvenido a Premium!')).toBeInTheDocument()
    expect(confirmCheckout).toHaveBeenCalledWith('cs_test_1')
    // El resto de la app (página de plan, nav) ve PREMIUM sin volver a pedirlo.
    expect(queryClient.getQueryData(['subscription', 'active'])).toEqual(PREMIUM)
  })

  it('reintenta mientras Stripe todavía no confirma el cobro (409)', async () => {
    confirmCheckout.mockRejectedValueOnce(httpError(409)).mockRejectedValueOnce(httpError(409)).mockResolvedValue(PREMIUM)

    renderReturnFromStripe('/subscription/success?session_id=cs_test_1')
    await act(() => vi.advanceTimersByTimeAsync(5000))

    expect(await screen.findByText('¡Bienvenido a Premium!')).toBeInTheDocument()
    expect(confirmCheckout).toHaveBeenCalledTimes(3)
  })

  it('si el cobro sigue sin confirmarse tras los reintentos, avisa que se está procesando', async () => {
    confirmCheckout.mockRejectedValue(httpError(409))

    renderReturnFromStripe('/subscription/success?session_id=cs_test_1')
    await act(() => vi.advanceTimersByTimeAsync(2000 * (CONFIRM_MAX_RETRIES + 1)))

    expect(await screen.findByText('Tu pago se está procesando')).toBeInTheDocument()
    expect(confirmCheckout).toHaveBeenCalledTimes(CONFIRM_MAX_RETRIES + 1)
  })

  it('no reintenta un error definitivo (sesión de otro usuario) y lo informa', async () => {
    confirmCheckout.mockRejectedValue(httpError(403))

    renderReturnFromStripe('/subscription/success?session_id=cs_ajena')

    expect(await screen.findByText('No pudimos confirmar el pago')).toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(10000))
    expect(confirmCheckout).toHaveBeenCalledTimes(1)
  })

  it('sin session_id en la URL no intenta confirmar y deja la activación al webhook', async () => {
    renderReturnFromStripe('/subscription/success')

    expect(await screen.findByText('Tu pago se está procesando')).toBeInTheDocument()
    expect(confirmCheckout).not.toHaveBeenCalled()
  })

  it('al cancelar en Stripe informa que no hubo cargo y no confirma nada', async () => {
    renderReturnFromStripe('/subscription/cancel', 'cancel')

    expect(await screen.findByText('Pago cancelado')).toBeInTheDocument()
    expect(confirmCheckout).not.toHaveBeenCalled()
  })
})
