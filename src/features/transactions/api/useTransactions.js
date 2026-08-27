import { useQuery } from '@tanstack/react-query'
import { fetchTransactions } from './transactionsApi'

export function useTransactions({ page = 0, size = 20 } = {}) {
  return useQuery({
    queryKey: ['transactions', page, size],
    queryFn: () => fetchTransactions({ page, size }),
  })
}

export default useTransactions
