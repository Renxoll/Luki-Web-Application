import { useMutation, useQueryClient } from '@tanstack/react-query'
import { syncGmailConnections } from './gmailApi'

/**
 * Refresco manual de gastos: dispara la lectura de la bandeja de Gmail y, al terminar,
 * invalida todo lo que pudo cambiar (transacciones, resumen del mes, remitentes pendientes
 * y la propia lista de conexiones, por su lastSyncedAt).
 */
export function useSyncGmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: syncGmailConnections,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics', 'monthly-summary'] })
      queryClient.invalidateQueries({ queryKey: ['pending-senders'] })
      queryClient.invalidateQueries({ queryKey: ['gmail', 'connections'] })
    },
  })
}

export default useSyncGmail
