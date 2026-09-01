import { useQuery } from '@tanstack/react-query'
import { fetchGroupDetail } from './groupsApi'

export function useGroupDetail(groupId) {
  return useQuery({
    queryKey: ['groups', groupId],
    queryFn: () => fetchGroupDetail(groupId),
    enabled: !!groupId,
  })
}

export default useGroupDetail
