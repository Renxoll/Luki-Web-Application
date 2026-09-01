import { useMutation, useQueryClient } from '@tanstack/react-query'
import { recordSettlement } from './groupsApi'

export function useRecordSettlement(groupId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settlement) => recordSettlement({ groupId, ...settlement }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups'], exact: true })
    },
  })
}

export default useRecordSettlement
