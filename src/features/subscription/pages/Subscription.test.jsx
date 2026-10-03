import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { redirectTo } from '../../../lib/redirect'
import { cancelSubscription, fetchActiveSubscription, startCheckout } from '../api/subscriptionApi'
import { Subscription } from './Subscription'

vi.mock('../api/subscriptionApi', () => ({
  fetchActiveSubscription: vi.fn(),
  startCheckout: vi.fn(),
  cancelSubscription: vi.fn(),
  confirmCheckout: vi.fn(),
}))
vi.mock('../../../lib/redirect', () => ({ redirectTo: vi.fn() }))

const FREE = { planCode: 'FREE', status: 'ACTIVE', startedAt: '2026-09-01T00:00:00Z', renewsAt: null, canceledAt: null }
const PREMIUM = { planCode: 'PREMIUM', status: 'ACTIVE', startedAt: '2026-10-01T00:00:00Z', renewsAt: '2026-10-31T00:00:00Z', canceledAt: null }

function httpError(status) {
  return Object.assign(new Error(`HTTP ${status}`), { response: { status } })
}

function renderPage() {
  return renderWithProviders(<Subscription />, { path: '/subscription' })
}

describe('Subscription (Plan y facturación)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('pasar a Premium inicia el checkout y redirige el navegador a Stripe', async () => {
    fetchActiveSubscription.mockResolvedValue(FREE)
    startCheckout.mockResolvedValue({ checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_1' })
    renderPage()

    await userEvent.click(await screen.findByRole('button', { name: 'Pasar a Premium' }))

    // TanStack Query le pasa a mutationFn un segundo argumento (contexto): solo importa el plan.
    expect(startCheckout.mock.calls[0][0]).toBe('PREMIUM')
    expect(redirectTo).toHaveBeenCalledWith('https://checkout.stripe.com/c/pay/cs_test_1')
  })

  it('elegir Gratis sin plan lo activa en el momento, sin pasar por Stripe', async () => {
    fetchActiveSubscription.mockResolvedValueOnce(null).mockResolvedValue(FREE)
    startCheckout.mockResolvedValue(FREE)
    renderPage()

    await userEvent.click(await screen.findByRole('button', { name: 'Elegir Gratis' }))

    expect(startCheckout.mock.calls[0][0]).toBe('FREE')
    expect(redirectTo).not.toHaveBeenCalled()
    expect(await screen.findByRole('button', { name: 'Plan actual' })).toBeDisabled()
  })

  it('muestra un mensaje claro si el backend rechaza el checkout porque ya hay un plan (409)', async () => {
    fetchActiveSubscription.mockResolvedValue(null)
    startCheckout.mockRejectedValue(httpError(409))
    renderPage()

    await userEvent.click(await screen.findByRole('button', { name: 'Pasar a Premium' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Ya tienes un plan activo')
    expect(redirectTo).not.toHaveBeenCalled()
  })

  it('muestra un mensaje específico si Stripe no responde (502)', async () => {
    fetchActiveSubscription.mockResolvedValue(null)
    startCheckout.mockRejectedValue(httpError(502))
    renderPage()

    await userEvent.click(await screen.findByRole('button', { name: 'Pasar a Premium' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Stripe no respondió')
  })

  it('con Premium activo no ofrece elegir Gratis y muestra la fecha de renovación', async () => {
    fetchActiveSubscription.mockResolvedValue(PREMIUM)
    renderPage()

    expect(await screen.findByRole('button', { name: 'Cancela Premium para volver' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Elegir Gratis' })).not.toBeInTheDocument()
    expect(screen.getByText(/Se renueva el/)).toBeInTheDocument()
  })

  it('cancelar Premium pide confirmación y luego cancela', async () => {
    fetchActiveSubscription.mockResolvedValueOnce(PREMIUM).mockResolvedValue(null)
    cancelSubscription.mockResolvedValue(undefined)
    renderPage()

    await userEvent.click(await screen.findByRole('button', { name: 'Cancelar plan' }))
    expect(cancelSubscription).not.toHaveBeenCalled()
    const confirmRow = screen.getByRole('button', { name: 'No, seguir' }).parentElement
    await userEvent.click(within(confirmRow).getByRole('button', { name: 'Cancelar plan' }))

    expect(cancelSubscription).toHaveBeenCalledTimes(1)
    expect(await screen.findByRole('button', { name: 'Pasar a Premium' })).toBeEnabled()
  })

  it('si la cancelación falla avisa que el plan sigue igual', async () => {
    fetchActiveSubscription.mockResolvedValue(PREMIUM)
    cancelSubscription.mockRejectedValue(httpError(502))
    renderPage()

    await userEvent.click(await screen.findByRole('button', { name: 'Cancelar plan' }))
    const confirmRow = screen.getByRole('button', { name: 'No, seguir' }).parentElement
    await userEvent.click(within(confirmRow).getByRole('button', { name: 'Cancelar plan' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cancelar el plan')
  })
})
