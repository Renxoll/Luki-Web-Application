import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test/renderWithProviders'
import {
  addWorkspaceCategory,
  archiveWorkspace,
  archiveWorkspaceCategory,
  createWorkspace,
} from '../api/workspacesApi'
import { WorkspaceCategoryEditor } from './WorkspaceCategoryEditor'
import { WorkspaceFormModal } from './WorkspaceFormModal'
import { WorkspaceSettingsModal } from './WorkspaceSettingsModal'

vi.mock('../api/workspacesApi', () => ({
  fetchWorkspaces: vi.fn(),
  createWorkspace: vi.fn(),
  updateWorkspace: vi.fn(),
  archiveWorkspace: vi.fn(),
  addWorkspaceCategory: vi.fn(),
  updateWorkspaceCategory: vi.fn(),
  archiveWorkspaceCategory: vi.fn(),
}))

const CATEGORIES = [
  { id: 'c-1', code: 'COMIDA', displayName: 'Comida', icon: 'utensils', position: 0, archived: false },
  { id: 'c-2', code: 'VIAJES', displayName: 'Viajes', icon: 'plane', position: 1, archived: false },
]
const CUSTOM = { id: 'w-1', name: 'Empresa', colorHex: '#8B5CF6', icon: 'wallet', isDefault: false, categories: CATEGORIES }

function conflict(message) {
  return Object.assign(new Error('HTTP 409'), { response: { status: 409, data: { message } } })
}

describe('Módulos: alta y errores 409', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('crear un módulo envía nombre, color e ícono por defecto y avisa con onCreated', async () => {
    const created = { ...CUSTOM, name: 'Hijo' }
    createWorkspace.mockResolvedValue(created)
    const onCreated = vi.fn()
    const onClose = vi.fn()
    renderWithProviders(<WorkspaceFormModal open onClose={onClose} onCreated={onCreated} />)

    await userEvent.type(screen.getByLabelText('Nombre'), '  Hijo  ')
    await userEvent.click(screen.getByRole('button', { name: 'Crear módulo' }))

    expect(createWorkspace.mock.calls[0][0]).toEqual({ name: 'Hijo', colorHex: '#8B5CF6', icon: 'wallet' })
    expect(onCreated.mock.calls[0][0]).toEqual(created)
    expect(onClose).toHaveBeenCalled()
  })

  it('si crear falla, muestra el mensaje genérico y no cierra el modal', async () => {
    createWorkspace.mockRejectedValue(Object.assign(new Error('HTTP 500'), { response: { status: 500 } }))
    const onClose = vi.fn()
    renderWithProviders(<WorkspaceFormModal open onClose={onClose} />)

    await userEvent.type(screen.getByLabelText('Nombre'), 'Hijo')
    await userEvent.click(screen.getByRole('button', { name: 'Crear módulo' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar el módulo')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('agregar una categoría duplicada muestra el mensaje del 409', async () => {
    addWorkspaceCategory.mockRejectedValue(conflict('Ya existe una categoría "Comida" en este módulo'))
    renderWithProviders(<WorkspaceCategoryEditor workspace={CUSTOM} />)

    await userEvent.type(screen.getByPlaceholderText('Nueva categoría'), 'Comida')
    await userEvent.click(screen.getByRole('button', { name: 'Agregar categoría' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe una categoría "Comida" en este módulo')
    expect(addWorkspaceCategory.mock.calls[0][0]).toBe('w-1')
  })

  it('archivar una categoría que el backend rechaza con 409 muestra el motivo', async () => {
    archiveWorkspaceCategory.mockRejectedValue(conflict('El módulo necesita al menos una categoría activa'))
    renderWithProviders(<WorkspaceCategoryEditor workspace={CUSTOM} />)

    await userEvent.click(screen.getByRole('button', { name: 'Archivar Viajes' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El módulo necesita al menos una categoría activa')
  })

  it('archivar un módulo con 409 muestra el motivo y no lo da por archivado', async () => {
    archiveWorkspace.mockRejectedValue(conflict('El módulo General no se puede archivar'))
    const onArchived = vi.fn()
    renderWithProviders(<WorkspaceSettingsModal open onClose={vi.fn()} workspace={CUSTOM} onArchived={onArchived} />)

    await userEvent.click(screen.getByRole('button', { name: 'Archivar este módulo' }))
    await userEvent.click(screen.getByRole('button', { name: 'Archivar módulo' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El módulo General no se puede archivar')
    expect(onArchived).not.toHaveBeenCalled()
  })
})
