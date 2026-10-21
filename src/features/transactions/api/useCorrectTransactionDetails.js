import { useMutation, useQueryClient } from '@tanstack/react-query'
import { correctTransactionDetails } from './transactionsApi'

/** Completar o corregir un gasto a mano cambia monto y categoría: afecta la lista y el resumen. */
export function useCorrectTransactionDetails() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ transactionId, ...payload }) => correctTransactionDetails(transactionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics', 'monthly-summary'] })
    },
  })
}

export default useCorrectTransactionDetails
