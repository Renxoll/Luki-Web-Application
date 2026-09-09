import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchTransactions } from './transactionsApi'

/** `workspaceId` null = módulo General (el backend lo asume por defecto). */
export function useTransactions({ page = 0, size = 20, workspaceId = null } = {}) {
  return useQuery({
    queryKey: ['transactions', workspaceId ?? 'general', page, size],
    queryFn: () => fetchTransactions({ page, size, workspaceId }),
    // Al cambiar de página se mantienen las filas anteriores mientras carga la siguiente --
    // así el paginador no parpadea a esqueleto y no hay que volver a scrollear.
    placeholderData: keepPreviousData,
    // Re-consulta sola mientras la pantalla está abierta: un gasto recién leído del correo
    // aparece sin que el usuario toque nada. `refetchIntervalInBackground` queda en false
    // (default) -- no consume red si la pestaña no está visible.
    refetchInterval: 45_000,
  })
}

export default useTransactions
