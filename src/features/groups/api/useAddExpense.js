import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addExpense } from './groupsApi'

export function useAddExpense(groupId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (expense) => addExpense({ groupId, ...expense }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups'], exact: true })
    },
  })
}

export default useAddExpense
