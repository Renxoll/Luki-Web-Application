import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { TransactionRow } from './TransactionRow'

vi.mock('../api/transactionsApi', () => ({
  fetchCategories: vi.fn().mockResolvedValue([]),
  updateTransactionCategory: vi.fn(),
  setInternalTransfer: vi.fn(),
  moveTransactionToWorkspace: vi.fn(),
  correctTransactionDetails: vi.fn(),
}))

const BASE = {
  transactionId: 't-1',
  status: 'PROCESSED',
  type: 'EXPENSE',
  amount: 10,
  currency: 'PEN',
  merchant: 'Starbucks',
  categoryCode: 'COMIDA',
  category: 'Comida',
  internalTransfer: false,
  createdAt: '2026-10-12T21:21:00Z',
  workspaceId: 'w-1',
}

function renderRow(transaction) {
  return renderWithProviders(
    <ul>
      <TransactionRow transaction={{ ...BASE, ...transaction }} />
    </ul>,
  )
}

describe('TransactionRow: comercio desconocido', () => {
  it('un gasto leído sin comercio ofrece "Agregar comercio"', () => {
    renderRow({ merchant: 'Desconocido' })

    expect(screen.getByText('Comercio desconocido')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Agregar comercio/ })).toBeInTheDocument()
  })

  it('un gasto que no se pudo leer ofrece "Completar a mano"', () => {
    renderRow({ status: 'FAILED', merchant: null, amount: null, category: null, categoryCode: null })

    expect(screen.getByRole('button', { name: /Completar a mano/ })).toBeInTheDocument()
  })

  it('con comercio conocido no ofrece nada', () => {
    renderRow({})

    expect(screen.getByText('Starbucks')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Agregar comercio|Completar a mano/ })).toBeNull()
  })

  it('un ingreso sin comercio se llama "Ingreso" y no pide completarlo', () => {
    renderRow({ type: 'INCOME', merchant: null, category: null, categoryCode: null })

    expect(screen.getByText('Ingreso', { selector: 'p' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Agregar comercio/ })).toBeNull()
  })
})
