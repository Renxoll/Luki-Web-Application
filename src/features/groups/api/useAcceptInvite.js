import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptInvite } from './groupsApi'

export function useAcceptInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export default useAcceptInvite
