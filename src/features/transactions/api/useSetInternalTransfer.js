import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setInternalTransfer } from './transactionsApi'

/**
 * Marca/desmarca una transacción como transferencia entre cuentas propias. Al cambiar,
 * el resumen del mes deja de contarla (o vuelve a contarla), así que se invalida.
 */
export function useSetInternalTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ transactionId, internalTransfer }) =>
      setInternalTransfer(transactionId, internalTransfer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics', 'monthly-summary'] })
    },
  })
}

export default useSetInternalTransfer
