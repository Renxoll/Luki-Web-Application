import { useState } from 'react'
import { Check, Crown, Sparkles } from 'lucide-react'
import { AppShell } from '../../../components/AppShell'
import { PageHeader } from '../../../components/PageHeader'
import { Button } from '../../../components/Button'
import { useActiveSubscription, useCancelSubscription, useStartCheckout } from '../api/useSubscription'

const dateFmt = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })

const PLANS = [
  {
    code: 'FREE',
    name: 'Gratis',
    price: 'S/ 0',
    period: 'para siempre',
    perks: ['Lectura automática de correos bancarios', 'Módulos y categorías ilimitados', 'Resumen mensual'],
    icon: Sparkles,
  },
  {
    code: 'PREMIUM',
    name: 'Premium',
    price: 'S/ 15',
    period: 'al mes',
    perks: ['Todo lo del plan Gratis', 'Asesor financiero con IA sin límites', 'Soporte prioritario'],
    icon: Crown,
    highlight: true,
  },
]

function PlanCard({ plan, currentCode, onChoose, isPending }) {
  const isCurrent = currentCode === plan.code
  const Icon = plan.icon
  return (
    <div
      className={`card relative flex flex-col p-5 ${
        plan.highlight ? 'border-neon-purple/40 ring-1 ring-neon-purple/20' : ''
      }`}
    >
      {isCurrent && (
        <span className="absolute right-4 top-4 chip border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          Tu plan
        </span>
      )}
      <span
        className={`grid h-10 w-10 place-items-center rounded-xl ${
          plan.highlight ? 'bg-brand-gradient text-white' : 'bg-white/[0.08] text-off-white/70'
        }`}
      >
        <Icon size={19} strokeWidth={2.2} />
      </span>
      <p className="mt-3 text-lg font-bold">{plan.name}</p>
      <p className="mt-0.5 text-sm text-off-white/55">
        <span className="text-xl font-extrabold text-off-white">{plan.price}</span> {plan.period}
      </p>
      <ul className="mt-4 flex-1 space-y-2 text-sm text-off-white/75">
        {plan.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <Check size={15} strokeWidth={2.6} className="mt-0.5 shrink-0 text-electric-mint" />
            {perk}
          </li>
        ))}
      </ul>
      <div className="mt-5">
        {isCurrent ? (
          <Button variant="ghost" size="sm" disabled className="w-full">
            Plan actual
          </Button>
        ) : (
          <Button
            variant={plan.highlight ? 'primary' : 'subtle'}
            size="sm"
            className="w-full"
            loading={isPending}
            onClick={() => onChoose(plan.code)}
          >
            {plan.code === 'PREMIUM' ? 'Pasar a Premium' : 'Elegir Gratis'}
          </Button>
        )}
      </div>
    </div>
  )
}

export function Subscription() {
  const { data: subscription, isLoading } = useActiveSubscription()
  const checkout = useStartCheckout()
  const cancel = useCancelSubscription()
  const [confirmCancel, setConfirmCancel] = useState(false)

  const currentCode = subscription?.planCode ?? null
  const isPremium = currentCode === 'PREMIUM' && subscription?.status === 'ACTIVE'

  return (
    <AppShell>
      <div className="animate-fade-up">
        <PageHeader title="Plan y facturación" subtitle="Gestiona tu suscripción de Luki." />

        {!isLoading && subscription && (
          <div className="card mb-5 flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-semibold">
                Plan {subscription.planCode === 'PREMIUM' ? 'Premium' : 'Gratis'}
                <span className="ml-2 text-xs font-normal text-off-white/50">{subscription.status}</span>
              </p>
              {subscription.renewsAt && (
                <p className="mt-0.5 text-xs text-off-white/50">
                  Se renueva el {dateFmt.format(new Date(subscription.renewsAt))}
                </p>
              )}
            </div>
            {isPremium &&
              (confirmCancel ? (
                <div className="flex items-center gap-2">
                  <Button variant="subtle" size="sm" onClick={() => setConfirmCancel(false)} disabled={cancel.isPending}>
                    No, seguir
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={cancel.isPending}
                    onClick={() => cancel.mutate(undefined, { onSuccess: () => setConfirmCancel(false) })}
                  >
                    Cancelar plan
                  </Button>
                </div>
              ) : (
                <Button variant="danger" size="sm" onClick={() => setConfirmCancel(true)}>
                  Cancelar plan
                </Button>
              ))}
          </div>
        )}

        {checkout.isError && (
          <p className="mb-4 text-sm text-rose-300">
            No se pudo iniciar el pago. Intenta de nuevo en unos minutos.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.code}
              plan={plan}
              currentCode={currentCode}
              isPending={checkout.isPending}
              onChoose={(code) => checkout.mutate(code)}
            />
          ))}
        </div>

        <p className="mt-4 text-xs text-off-white/40">
          Los pagos se procesan de forma segura con Stripe. Puedes cancelar cuando quieras.
        </p>
      </div>
    </AppShell>
  )
}

export default Subscription
