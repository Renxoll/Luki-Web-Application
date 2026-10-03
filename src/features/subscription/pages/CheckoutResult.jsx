import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { AppShell } from '../../../components/AppShell'
import { Button } from '../../../components/Button'
import { Spinner } from '../../../components/Spinner'
import { useConfirmCheckout } from '../api/useSubscription'

const VIEWS = {
  confirming: {
    title: 'Confirmando tu pago…',
    body: 'Estamos verificando el pago con Stripe. Esto toma unos segundos.',
  },
  activated: {
    icon: CheckCircle2,
    tone: 'bg-emerald-500/15 text-emerald-300',
    title: '¡Bienvenido a Premium!',
    body: 'Tu plan ya está activo. Ya puedes usar el asesor sin límites.',
  },
  processing: {
    icon: Clock,
    tone: 'bg-amber-500/15 text-amber-300',
    title: 'Tu pago se está procesando',
    body: 'Stripe todavía no confirma el cobro. Tu plan se activará solo apenas se confirme; puedes revisarlo en unos minutos.',
  },
  failed: {
    icon: XCircle,
    tone: 'bg-rose-500/15 text-rose-300',
    title: 'No pudimos confirmar el pago',
    body: 'Si se hizo un cargo, tu plan se activará automáticamente. Si no ves Premium en unos minutos, escríbenos.',
  },
  canceled: {
    icon: XCircle,
    tone: 'bg-white/[0.06] text-off-white/50',
    title: 'Pago cancelado',
    body: 'No se hizo ningún cargo. Puedes intentarlo de nuevo cuando quieras.',
  },
}

function viewFor(outcome, sessionId, confirmation) {
  if (outcome !== 'success') return 'canceled'
  // Sin session_id (enlace viejo o abierto a mano) no hay nada que confirmar: la activación
  // queda en manos del webhook.
  if (!sessionId) return 'processing'
  if (confirmation.isSuccess) return 'activated'
  if (confirmation.isError) return confirmation.error?.response?.status === 409 ? 'processing' : 'failed'
  return 'confirming'
}

/**
 * Pantalla de vuelta de Stripe Checkout. `outcome` viene del router: 'success' o 'cancel'.
 * En éxito Stripe agrega `?session_id=`; con eso se confirma el pago contra el backend, que lo
 * verifica con Stripe y activa el plan sin esperar al webhook.
 */
export function CheckoutResult({ outcome }) {
  const [searchParams] = useSearchParams()
  const sessionId = outcome === 'success' ? searchParams.get('session_id') : null
  const confirmation = useConfirmCheckout(sessionId)
  const queryClient = useQueryClient()
  const view = viewFor(outcome, sessionId, confirmation)
  const { icon: Icon, tone, title, body } = VIEWS[view]

  useEffect(() => {
    // Sin confirmación posible, al menos se refresca el plan por si el webhook ya llegó.
    if (view === 'processing' || view === 'failed') {
      queryClient.invalidateQueries({ queryKey: ['subscription', 'active'] })
    }
  }, [view, queryClient])

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto max-w-md py-10 text-center" role="status" aria-live="polite">
        <span className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${tone ?? 'bg-white/[0.06] text-off-white/70'}`}>
          {Icon ? <Icon size={26} /> : <Spinner size={22} />}
        </span>
        <h1 className="mt-4 text-xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-off-white/60">{body}</p>
        {view !== 'confirming' && (
          <div className="mt-6 flex justify-center gap-2">
            <Button to="/dashboard" variant="ghost" size="sm">
              Ir al resumen
            </Button>
            <Button to="/subscription" variant="primary" size="sm">
              Ver mi plan
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default CheckoutResult
