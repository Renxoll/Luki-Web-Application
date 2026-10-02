import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { redirectTo } from '../../../lib/redirect'
import { cancelSubscription, confirmCheckout, fetchActiveSubscription, startCheckout } from './subscriptionApi'

const KEY = ['subscription', 'active']

// Stripe puede tardar unos segundos en marcar el cobro como pagado después de redirigir: el
// backend responde 409 mientras tanto. ~30 s de reintentos cubre el caso normal con tarjeta.
export const CONFIRM_MAX_RETRIES = 15
const CONFIRM_RETRY_DELAY_MS = 2000

export function useActiveSubscription() {
  return useQuery({
    queryKey: KEY,
    queryFn: fetchActiveSubscription,
    staleTime: 60 * 1000,
  })
}

/**
 * Inicia el checkout. Para PREMIUM redirige el navegador a Stripe; para FREE refresca la
 * query de suscripción.
 */
export function useStartCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: startCheckout,
    onSuccess: (data) => {
      if (data?.checkoutUrl) {
        redirectTo(data.checkoutUrl)
        return
      }
      queryClient.invalidateQueries({ queryKey: KEY })
    },
  })
}

/**
 * Confirma la sesión de Stripe con la que volvió el usuario. Reintenta solo ante 409 (pago
 * todavía no confirmado); 403/404 son definitivos. Al terminar deja la suscripción nueva en
 * la cache, así el resto de la app ve PREMIUM sin otro request.
 */
export function useConfirmCheckout(sessionId, { retryDelay = CONFIRM_RETRY_DELAY_MS } = {}) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: ['subscription', 'confirm', sessionId],
    queryFn: async () => {
      const subscription = await confirmCheckout(sessionId)
      queryClient.setQueryData(KEY, subscription)
      return subscription
    },
    enabled: Boolean(sessionId),
    retry: (failureCount, error) => error?.response?.status === 409 && failureCount < CONFIRM_MAX_RETRIES,
    retryDelay,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}

export default useActiveSubscription
