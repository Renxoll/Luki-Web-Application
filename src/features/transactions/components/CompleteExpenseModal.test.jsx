import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { correctTransactionDetails, fetchCategories } from '../api/transactionsApi'
import { CompleteExpenseModal } from './CompleteExpenseModal'

vi.mock('../api/transactionsApi', () => ({
  correctTransactionDetails: vi.fn(),
  fetchCategories: vi.fn(),
}))

const CATEGORIES = [
  { code: 'COMIDA', displayName: 'Comida', icon: 'utensils' },
  { code: 'TRANSPORTE', displayName: 'Transporte', icon: 'bus' },
]
const FAILED = { transactionId: 't-1', status: 'FAILED', type: null, amount: null, merchant: null }
const UNKNOWN = { transactionId: 't-2', status: 'PROCESSED', type: 'EXPENSE', amount: 10, merchant: 'Desconocido' }

function httpError(status) {
  return Object.assign(new Error(`HTTP ${status}`), { response: { status } })
}

describe('CompleteExpenseModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchCategories.mockResolvedValue(CATEGORIES)
  })

  it('completa un gasto que Luki no pudo leer: monto, comercio y categoría', async () => {
    correctTransactionDetails.mockResolvedValue({})
    const onClose = vi.fn()
    renderWithProviders(<CompleteExpenseModal open onClose={onClose} transaction={FAILED} />)

    await screen.findByRole('option', { name: 'Transporte' })
    await userEvent.type(screen.getByLabelText('Monto (S/)'), '10')
    await userEvent.type(screen.getByLabelText('¿En qué o a quién?'), 'Metropolitano')
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'TRANSPORTE')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    // TanStack Query le pasa un segundo argumento a mutationFn: solo importan los dos primeros.
    expect(correctTransactionDetails.mock.calls[0][0]).toBe('t-1')
    expect(correctTransactionDetails.mock.calls[0][1]).toEqual({ amount: 10, merchant: 'Metropolitano', categoryCode: 'TRANSPORTE' })
    expect(onClose).toHaveBeenCalled()
  })

  it('en un gasto ya leído solo pide el comercio y no manda categoría', async () => {
    correctTransactionDetails.mockResolvedValue({})
    renderWithProviders(<CompleteExpenseModal open onClose={vi.fn()} transaction={UNKNOWN} />)

    expect(screen.queryByLabelText('Categoría')).toBeNull()
    // El monto ya leído viene precargado y "Desconocido" no se copia al campo de comercio.
    expect(screen.getByLabelText('Monto (S/)')).toHaveValue(10)
    expect(screen.getByLabelText('¿En qué o a quién?')).toHaveValue('')

    await userEvent.type(screen.getByLabelText('¿En qué o a quién?'), 'Almuerzo')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(correctTransactionDetails.mock.calls[0][1]).toEqual({ amount: 10, merchant: 'Almuerzo' })
  })

  it('un 409 explica que el movimiento ya no se puede editar', async () => {
    correctTransactionDetails.mockRejectedValue(httpError(409))
    renderWithProviders(<CompleteExpenseModal open onClose={vi.fn()} transaction={UNKNOWN} />)

    await userEvent.type(screen.getByLabelText('¿En qué o a quién?'), 'Almuerzo')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('ya no se puede editar')
  })
})
