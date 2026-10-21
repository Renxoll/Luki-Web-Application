import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { moveTransactionToWorkspace } from '../api/transactionsApi'
import { MoveTransactionMenu } from './MoveTransactionMenu'

vi.mock('../api/transactionsApi', () => ({ moveTransactionToWorkspace: vi.fn() }))

const WORKSPACES = [
  { id: 'w-general', name: 'General', colorHex: '#8B5CF6', icon: 'wallet', isDefault: true, categories: [] },
  {
    id: 'w-empresa',
    name: 'Empresa',
    colorHex: '#0EA5E9',
    icon: 'wallet',
    isDefault: false,
    categories: [
      { id: 'c-1', code: 'VIAJES', displayName: 'Viajes', icon: 'plane', position: 0, archived: false },
      { id: 'c-2', code: 'VIEJA', displayName: 'Vieja', icon: 'plane', position: 1, archived: true },
    ],
  },
]
const EXPENSE = { transactionId: 't-1', type: 'EXPENSE', workspaceId: 'w-general' }

function renderMenu(transaction = EXPENSE) {
  return renderWithProviders(
    <ul>
      <li data-testid="row">
        <MoveTransactionMenu transaction={transaction} workspaces={WORKSPACES} currentWorkspaceId="w-general" />
      </li>
    </ul>,
  )
}

describe('MoveTransactionMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('pinta el menú fuera de la fila (portal en body) para que ninguna tarjeta lo tape', async () => {
    renderMenu()

    await userEvent.click(screen.getByRole('button', { name: 'Mover a otro módulo' }))

    const menu = await screen.findByRole('menu')
    expect(menu.closest('[data-testid="row"]')).toBeNull()
    expect(document.body.contains(menu)).toBe(true)
    // No ofrece el módulo donde ya está la transacción.
    expect(within(menu).queryByText('General')).toBeNull()
    expect(within(menu).getByText('Empresa')).toBeInTheDocument()
  })

  it('un gasto pide categoría del módulo destino (sin las archivadas) y recién ahí se mueve', async () => {
    moveTransactionToWorkspace.mockResolvedValue({})
    renderMenu()

    await userEvent.click(screen.getByRole('button', { name: 'Mover a otro módulo' }))
    await userEvent.click(await screen.findByText('Empresa'))
    expect(screen.queryByText('Vieja')).toBeNull()
    await userEvent.click(screen.getByText('Viajes'))

    // TanStack Query le pasa un segundo argumento a mutationFn: solo importan los dos primeros.
    expect(moveTransactionToWorkspace.mock.calls[0][0]).toBe('t-1')
    expect(moveTransactionToWorkspace.mock.calls[0][1]).toEqual({ workspaceId: 'w-empresa', categoryCode: 'VIAJES' })
  })

  it('se cierra con Escape', async () => {
    renderMenu()

    await userEvent.click(screen.getByRole('button', { name: 'Mover a otro módulo' }))
    await screen.findByRole('menu')
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).toBeNull()
  })
})
