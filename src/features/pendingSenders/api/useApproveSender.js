import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approvePendingSender } from './pendingSendersApi'

export function useApproveSender() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approvePendingSender,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-senders'] })
    },
  })
}

export default useApproveSender
