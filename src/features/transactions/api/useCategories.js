import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from './transactionsApi'

export function useCategories() {
  return useQuery({
    queryKey: ['transactions', 'categories'],
    queryFn: fetchCategories,
    // Catálogo cerrado de 8 categorías (ver CategoryCode en el backend): no cambia en
    // el ciclo de vida de una sesión, así que no vale la pena refetchear seguido.
    staleTime: 60 * 60 * 1000,
  })
}

export default useCategories
