import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inviteMember } from './groupsApi'

export function useInviteMember(groupId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (email) => inviteMember(groupId, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] })
    },
  })
}

export default useInviteMember
