import { useQuery } from '@tanstack/react-query'
import { fetchWorkspaces } from './workspacesApi'

/**
 * Lista de módulos del usuario (el "General" siempre primero). Cambia poco durante una
 * sesión, pero cada mutación de módulo invalida esta query (ver useWorkspaceMutations).
 */
export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: fetchWorkspaces,
    staleTime: 5 * 60 * 1000,
  })
}

export default useWorkspaces
