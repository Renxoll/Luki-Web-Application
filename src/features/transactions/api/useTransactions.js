import { useQuery } from '@tanstack/react-query'
import { fetchTransactions } from './transactionsApi'

/** `workspaceId` null = módulo General (el backend lo asume por defecto). */
export function useTransactions({ page = 0, size = 20, workspaceId = null } = {}) {
  return useQuery({
    queryKey: ['transactions', workspaceId ?? 'general', page, size],
    queryFn: () => fetchTransactions({ page, size, workspaceId }),
  })
}

export default useTransactions
