import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, XCircle } from 'lucide-react'
import { AppShell } from '../../../components/AppShell'
import { Button } from '../../../components/Button'

/**
 * Pantalla de vuelta de Stripe Checkout. `outcome` viene del router: 'success' o 'cancel'.
 * En éxito, la activación real la hace el webhook de Stripe en el backend -- acá solo
 * refrescamos la query y confirmamos.
 */
export function CheckoutResult({ outcome }) {
  const queryClient = useQueryClient()
  const success = outcome === 'success'

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['subscription', 'active'] })
    }
  }, [success, queryClient])

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto max-w-md py-10 text-center">
        <span
          className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${
            success ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/[0.06] text-off-white/50'
          }`}
        >
          {success ? <CheckCircle2 size={26} /> : <XCircle size={26} />}
        </span>
        <h1 className="mt-4 text-xl font-bold tracking-tight">
          {success ? '¡Bienvenido a Premium!' : 'Pago cancelado'}
        </h1>
        <p className="mt-2 text-sm text-off-white/60">
          {success
            ? 'Tu plan puede tardar unos segundos en activarse. Ya puedes usar el asesor sin límites.'
            : 'No se hizo ningún cargo. Puedes intentarlo de nuevo cuando quieras.'}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button to="/dashboard" variant="ghost" size="sm">
            Ir al resumen
          </Button>
          <Button to="/subscription" variant="primary" size="sm">
            Ver mi plan
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

export default CheckoutResult
