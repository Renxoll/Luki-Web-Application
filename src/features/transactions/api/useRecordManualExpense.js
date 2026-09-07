import { useMutation, useQueryClient } from '@tanstack/react-query'
import { recordManualExpense } from './transactionsApi'

export function useRecordManualExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recordManualExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics', 'monthly-summary'] })
    },
  })
}

export default useRecordManualExpense
