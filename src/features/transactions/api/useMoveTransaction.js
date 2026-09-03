import { useMutation, useQueryClient } from '@tanstack/react-query'
import { moveTransactionToWorkspace } from './transactionsApi'

/** Mueve una transacción a otro módulo. Cambia qué módulo la cuenta, así que se invalidan
 * transacciones y el resumen mensual. */
export function useMoveTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ transactionId, workspaceId, categoryCode }) =>
      moveTransactionToWorkspace(transactionId, { workspaceId, categoryCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics', 'monthly-summary'] })
    },
  })
}

export default useMoveTransaction
