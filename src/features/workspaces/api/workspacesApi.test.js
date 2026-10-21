import { beforeEach, describe, expect, it, vi } from 'vitest'
import apiClient from '../../../api/apiClient'
import {
  addWorkspaceCategory,
  archiveWorkspace,
  archiveWorkspaceCategory,
  createWorkspace,
  fetchWorkspaces,
  updateWorkspace,
  updateWorkspaceCategory,
} from './workspacesApi'

vi.mock('../../../api/apiClient', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}))

const WORKSPACE = {
  id: 'w-1',
  name: 'Empresa',
  colorHex: '#8B5CF6',
  icon: 'wallet',
  isDefault: false,
  createdAt: '2026-10-01T00:00:00Z',
  categories: [],
}

function httpError(status) {
  return Object.assign(new Error(`HTTP ${status}`), { response: { status } })
}

describe('workspacesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchWorkspaces lista los módulos del usuario', async () => {
    apiClient.get.mockResolvedValue({ data: [WORKSPACE] })

    await expect(fetchWorkspaces()).resolves.toEqual([WORKSPACE])
    expect(apiClient.get).toHaveBeenCalledWith('/workspaces')
  })

  it('createWorkspace envía nombre, color e ícono y devuelve el módulo creado', async () => {
    apiClient.post.mockResolvedValue({ data: WORKSPACE })
    const payload = { name: 'Empresa', colorHex: '#8B5CF6', icon: 'wallet' }

    await expect(createWorkspace(payload)).resolves.toEqual(WORKSPACE)
    expect(apiClient.post).toHaveBeenCalledWith('/workspaces', payload)
  })

  it('createWorkspace propaga los errores HTTP', async () => {
    apiClient.post.mockRejectedValue(httpError(400))

    await expect(createWorkspace({ name: '' })).rejects.toMatchObject({ response: { status: 400 } })
  })

  it('updateWorkspace manda un PATCH al módulo', async () => {
    apiClient.patch.mockResolvedValue({ data: WORKSPACE })

    await expect(updateWorkspace('w-1', { name: 'Nuevo' })).resolves.toEqual(WORKSPACE)
    expect(apiClient.patch).toHaveBeenCalledWith('/workspaces/w-1', { name: 'Nuevo' })
  })

  it('archiveWorkspace borra el módulo y propaga el 409 del General', async () => {
    apiClient.delete.mockResolvedValueOnce({})
    await archiveWorkspace('w-1')
    expect(apiClient.delete).toHaveBeenCalledWith('/workspaces/w-1')

    apiClient.delete.mockRejectedValueOnce(httpError(409))
    await expect(archiveWorkspace('general')).rejects.toMatchObject({ response: { status: 409 } })
  })

  it('addWorkspaceCategory envía solo displayName e ícono (el code lo deriva el backend)', async () => {
    apiClient.post.mockResolvedValue({ data: WORKSPACE })

    await addWorkspaceCategory('w-1', { displayName: 'Viajes' })

    expect(apiClient.post).toHaveBeenCalledWith('/workspaces/w-1/categories', { displayName: 'Viajes' })
  })

  it('updateWorkspaceCategory y archiveWorkspaceCategory devuelven el módulo actualizado', async () => {
    apiClient.patch.mockResolvedValue({ data: WORKSPACE })
    apiClient.delete.mockResolvedValue({ data: WORKSPACE })

    await expect(updateWorkspaceCategory('w-1', 'c-1', { displayName: 'Comida' })).resolves.toEqual(WORKSPACE)
    expect(apiClient.patch).toHaveBeenCalledWith('/workspaces/w-1/categories/c-1', { displayName: 'Comida' })

    await expect(archiveWorkspaceCategory('w-1', 'c-1')).resolves.toEqual(WORKSPACE)
    expect(apiClient.delete).toHaveBeenCalledWith('/workspaces/w-1/categories/c-1')
  })
})
