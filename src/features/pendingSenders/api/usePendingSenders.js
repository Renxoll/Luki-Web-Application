import { useQuery } from '@tanstack/react-query'
import { fetchPendingSenders } from './pendingSendersApi'

export function usePendingSenders() {
  return useQuery({
    queryKey: ['pending-senders'],
    queryFn: fetchPendingSenders,
  })
}

export default usePendingSenders
