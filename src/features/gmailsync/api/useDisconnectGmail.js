import { useMutation, useQueryClient } from '@tanstack/react-query'
import { disconnectGmailConnection } from './gmailApi'

export function useDisconnectGmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: disconnectGmailConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gmail', 'connections'] })
    },
  })
}

export default useDisconnectGmail
