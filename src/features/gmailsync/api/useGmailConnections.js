import { useQuery } from '@tanstack/react-query'
import { fetchGmailConnections } from './gmailApi'

export function useGmailConnections() {
  return useQuery({
    queryKey: ['gmail', 'connections'],
    queryFn: fetchGmailConnections,
  })
}

export default useGmailConnections
