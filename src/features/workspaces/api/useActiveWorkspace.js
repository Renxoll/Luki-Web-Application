import { useWorkspaces } from './useWorkspaces'
import { useWorkspaceStore } from '../../../store/useWorkspaceStore'

/**
 * Resuelve el módulo activo: el que eligió el usuario, o el "General" si no eligió ninguno
 * (o si el que había elegido ya no existe). `workspaceIdParam` es lo que se pasa al backend
 * -- `null` cuando es el General (el backend ya lo asume por defecto).
 */
export function useActiveWorkspace() {
  const { data: workspaces = [], isLoading } = useWorkspaces()
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)

  const defaultWorkspace = workspaces.find((w) => w.isDefault) ?? workspaces[0] ?? null
  const chosen = activeWorkspaceId ? workspaces.find((w) => w.id === activeWorkspaceId) : null
  const workspace = chosen ?? defaultWorkspace

  return {
    workspaces,
    workspace,
    isLoading,
    isDefault: !workspace || workspace.isDefault,
    // Solo se manda al backend cuando NO es el General.
    workspaceIdParam: workspace && !workspace.isDefault ? workspace.id : null,
  }
}

export default useActiveWorkspace
