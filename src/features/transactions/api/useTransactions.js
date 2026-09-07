import { useQuery } from '@tanstack/react-query'
import { fetchTransactions } from './transactionsApi'

/** `workspaceId` null = módulo General (el backend lo asume por defecto). */
export function useTransactions({ page = 0, size = 20, workspaceId = null } = {}) {
  return useQuery({
    queryKey: ['transactions', workspaceId ?? 'general', page, size],
    queryFn: () => fetchTransactions({ page, size, workspaceId }),
    // Re-consulta sola mientras la pantalla está abierta: un gasto recién leído del correo
    // aparece sin que el usuario toque nada. `refetchIntervalInBackground` queda en false
    // (default) -- no consume red si la pestaña no está visible.
    refetchInterval: 45_000,
  })
}

export default useTransactions
