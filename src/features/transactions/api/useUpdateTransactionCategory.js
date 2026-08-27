import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTransactionCategory } from './transactionsApi'

export function useUpdateTransactionCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ transactionId, categoryCode }) => updateTransactionCategory(transactionId, categoryCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      // El resumen mensual del dashboard agrupa por categoría (join en vivo del lado del
      // backend): recategorizar acá cambia esos números, así que también hay que
      // invalidarlo o quedaría desactualizado hasta el próximo staleTime.
      queryClient.invalidateQueries({ queryKey: ['analytics', 'monthly-summary'] })
    },
  })
}

export default useUpdateTransactionCategory
