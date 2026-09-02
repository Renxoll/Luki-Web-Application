import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cancelSubscription, fetchActiveSubscription, startCheckout } from './subscriptionApi'

const KEY = ['subscription', 'active']

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
        window.location.href = data.checkoutUrl
        return
      }
      queryClient.invalidateQueries({ queryKey: KEY })
    },
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}
