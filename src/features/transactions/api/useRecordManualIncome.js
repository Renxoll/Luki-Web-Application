import { useMutation, useQueryClient } from '@tanstack/react-query'
import { recordManualIncome } from './transactionsApi'

export function useRecordManualIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recordManualIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics', 'monthly-summary'] })
    },
  })
}

export default useRecordManualIncome
