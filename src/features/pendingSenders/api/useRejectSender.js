import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rejectPendingSender } from './pendingSendersApi'

export function useRejectSender() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectPendingSender,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-senders'] })
    },
  })
}

export default useRejectSender
