import { useMutation, useQueryClient } from '@tanstack/react-query'
import { declineInvite } from './groupsApi'

export function useDeclineInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: declineInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export default useDeclineInvite
