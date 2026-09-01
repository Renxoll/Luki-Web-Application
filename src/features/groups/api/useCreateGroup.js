import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createGroup } from './groupsApi'

export function useCreateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export default useCreateGroup
