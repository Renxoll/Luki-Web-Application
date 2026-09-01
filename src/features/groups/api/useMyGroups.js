import { useQuery } from '@tanstack/react-query'
import { fetchMyGroups } from './groupsApi'

export function useMyGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: fetchMyGroups,
  })
}

export default useMyGroups
