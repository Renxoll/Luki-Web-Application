import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Módulo activo en la interfaz. `null` = módulo "General" (el que el backend usa por
 * defecto cuando no se manda `workspaceId`). Persistido para que la elección sobreviva
 * a un refresh; se limpia en el logout (ver AppShell).
 */
export const useWorkspaceStore = create(
  persist(
    (set) => ({
      activeWorkspaceId: null,

      setActiveWorkspace: (activeWorkspaceId) => set({ activeWorkspaceId }),

      reset: () => set({ activeWorkspaceId: null }),
    }),
    {
      name: 'luki-workspace-storage',
    }
  )
)
