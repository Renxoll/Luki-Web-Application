import { useQuery } from '@tanstack/react-query'
import { fetchMyPendingInvites } from './groupsApi'

export function useMyPendingInvites() {
  return useQuery({
    queryKey: ['groups', 'invites'],
    queryFn: fetchMyPendingInvites,
  })
}

export default useMyPendingInvites
