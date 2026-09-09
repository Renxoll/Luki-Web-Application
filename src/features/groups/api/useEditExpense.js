import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editExpense } from './groupsApi'

export function useEditExpense(groupId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ expenseId, ...expense }) => editExpense({ groupId, expenseId, ...expense }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups'], exact: true })
    },
  })
}

export default useEditExpense
