import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addWorkspaceCategory,
  archiveWorkspace,
  archiveWorkspaceCategory,
  createWorkspace,
  updateWorkspace,
  updateWorkspaceCategory,
} from './workspacesApi'

/**
 * Todas las mutaciones de módulos en un solo hook -- todas invalidan `['workspaces']`, y
 * las que afectan la clasificación de gastos invalidan además transacciones y el resumen
 * mensual del dashboard.
 */
export function useWorkspaceMutations() {
  const queryClient = useQueryClient()

  const invalidateWorkspaces = () => queryClient.invalidateQueries({ queryKey: ['workspaces'] })
  const invalidateEverything = () => {
    invalidateWorkspaces()
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
    queryClient.invalidateQueries({ queryKey: ['analytics', 'monthly-summary'] })
  }

  const create = useMutation({
    mutationFn: createWorkspace,
    onSuccess: invalidateWorkspaces,
  })

  const update = useMutation({
    mutationFn: ({ id, ...payload }) => updateWorkspace(id, payload),
    onSuccess: invalidateWorkspaces,
  })

  const archive = useMutation({
    mutationFn: (id) => archiveWorkspace(id),
    onSuccess: invalidateEverything,
  })

  const addCategory = useMutation({
    mutationFn: ({ id, ...payload }) => addWorkspaceCategory(id, payload),
    onSuccess: invalidateWorkspaces,
  })

  const updateCategory = useMutation({
    mutationFn: ({ id, categoryId, ...payload }) => updateWorkspaceCategory(id, categoryId, payload),
    onSuccess: invalidateEverything,
  })

  const archiveCategory = useMutation({
    mutationFn: ({ id, categoryId }) => archiveWorkspaceCategory(id, categoryId),
    onSuccess: invalidateEverything,
  })

  return { create, update, archive, addCategory, updateCategory, archiveCategory }
}

export default useWorkspaceMutations
