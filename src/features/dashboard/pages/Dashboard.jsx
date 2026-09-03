import { Link, useSearchParams } from 'react-router-dom'
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Inbox,
} from 'lucide-react'
import { useMonthlySummary } from '../../analytics/api/useMonthlySummary'
import { useGmailConnections } from '../../gmailsync/api/useGmailConnections'
import { RefreshExpensesButton } from '../../gmailsync/components/RefreshExpensesButton'
import { PendingSendersList } from '../../pendingSenders/components/PendingSendersList'
import { useAuthStore } from '../../../store/useAuthStore'
import { AppShell } from '../../../components/AppShell'
import { WorkspaceSwitcher } from '../../workspaces/components/WorkspaceSwitcher'
import { useActiveWorkspace } from '../../workspaces/api/useActiveWorkspace'
import { CategoryBreakdownPanel } from '../../analytics/components/CategoryBreakdownPanel'

// A diferencia de antes, la moneda ya no es siempre PEN -- el dashboard ahora puede traer
// un CurrencySummary por cada moneda con movimiento (ver useMonthlySummary), así que el
// formatter se arma por llamada en vez de ser una constante fija a PEN.
function formatCurrency(amount, currency = 'PEN') {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount ?? 0)
}

function InboxBanner({ inboxAddress }) {
  if (!inboxAddress) return null
  return (
    <div className="card flex items-start gap-3 p-4">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neon-purple/15 text-neon-purple">
        <Inbox size={18} strokeWidth={2.2} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-off-white/75">
          ¿Prefieres reenviar? Manda tus notificaciones bancarias a:
        </p>
        <p className="mt-1 break-all font-mono text-sm font-semibold text-neon-purple">{inboxAddress}</p>
      </div>
    </div>
  )
}

function GmailCard({ gmailStatus }) {
  const { data: connections } = useGmailConnections()
  const count = connections?.length ?? 0

  return (
    <div className="space-y-3">
      <Link
        to="/gmail-accounts"
        className="card card-hover flex items-center justify-between gap-3 p-4"
      >
        <span className="flex items-center gap-3 text-sm">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-electric-mint/15 text-electric-mint">
            <Mail size={18} strokeWidth={2.2} />
          </span>
          <span className="text-off-white/80">
            {count > 0
              ? `${count} cuenta${count > 1 ? 's' : ''} de Gmail conectada${count > 1 ? 's' : ''}`
              : 'Conecta tu Gmail para que Luki lea tus notificaciones bancarias solo'}
          </span>
        </span>
        <span className="shrink-0 text-xs font-semibold text-electric-mint">Gestionar →</span>
      </Link>

      {count > 0 && <RefreshExpensesButton className="px-1" />}

      {gmailStatus === 'connected' && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-300">
          <CheckCircle2 size={16} className="shrink-0" />
          Tu Gmail quedó conectado. Los próximos correos bancarios se procesan solos.
        </div>
      )}
      {gmailStatus === 'error' && (
        <div className="flex items-center gap-2 rounded-xl border border-orange-400/25 bg-orange-400/10 p-3 text-sm text-orange-300">
          <AlertTriangle size={16} className="shrink-0" />
          No se pudo conectar tu Gmail. Intenta de nuevo.
        </div>
      )}
    </div>
  )
}

function HeroSkeleton() {
  return <div className="h-44 animate-pulse rounded-2xl bg-white/[0.05]" />
}

function Hero({ data }) {
  const net = (data.totalIncome ?? 0) - (data.totalSpent ?? 0)
  const positive = net >= 0
  const variation =
    data.previousMonthTotal > 0
      ? ((data.totalSpent - data.previousMonthTotal) / data.previousMonthTotal) * 100
      : null
  const spentMore = variation != null && variation > 0

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-card backdrop-blur-sm">
      <div className="absolute inset-0 -z-10 bg-brand-fade" />
      <div className="absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-neon-purple/25 blur-3xl" />

      <p className="section-title">Balance neto de este mes {data.currency !== 'PEN' && `(${data.currency})`}</p>
      <p
        className={`mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl ${
          positive ? 'text-off-white' : 'text-rose-300'
        }`}
      >
        {positive ? '' : '−'}
        {formatCurrency(Math.abs(net), data.currency)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="chip">
          <ArrowDownRight size={13} className="text-emerald-400" />
          Ingresos {formatCurrency(data.totalIncome, data.currency)}
        </span>
        <span className="chip">
          <ArrowUpRight size={13} className="text-orange-400" />
          Gastos {formatCurrency(data.totalSpent, data.currency)}
        </span>
        {variation != null && (
          <span
            className={`chip ${
              spentMore ? 'text-orange-300' : 'text-emerald-300'
            }`}
          >
            {spentMore ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {spentMore ? '+' : ''}
            {variation.toFixed(1)}% vs. mes anterior
          </span>
        )}
      </div>
    </div>
  )
}

function BreakdownSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.05]" />
      ))}
    </div>
  )
}

export function Dashboard() {
  const [searchParams] = useSearchParams()
  const inboxAddress = useAuthStore((state) => state.inboxAddress)
  const user = useAuthStore((state) => state.user)
  const { workspace, workspaceIdParam } = useActiveWorkspace()
  const { data, isLoading, isError, error } = useMonthlySummary(workspaceIdParam)
  const gmailStatus = searchParams.get('gmail')

  const displayName =
    user?.name || user?.displayName || (user?.email || '').split('@')[0]
  const accentHex = workspace?.colorHex || '#8B5CF6'

  return (
    <AppShell maxWidth="max-w-6xl">
      <div className="animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Hola{displayName ? `, ${displayName}` : ''}
          </h1>
          <p className="mt-1 text-sm text-off-white/55">
            {workspace && !workspace.isDefault
              ? `El pulso del módulo “${workspace.name}”.`
              : 'Este es el pulso de tu mes.'}
          </p>
        </div>

        <WorkspaceSwitcher className="mt-5" />

        {/* Desktop: dos columnas que caben en una pantalla, sin scroll de página.
            Móvil: una sola columna con scroll natural. */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:items-start">
          <div className="space-y-6 lg:col-span-2">
            {isLoading && <HeroSkeleton />}
            {isError && (
              <div className="card border-orange-400/25 bg-orange-400/10 p-6">
                <p className="font-semibold text-orange-300">No pudimos cargar tu resumen</p>
                <p className="mt-1 text-sm text-off-white/60">
                  {error?.message || 'Inténtalo de nuevo en unos minutos.'}
                </p>
              </div>
            )}
            {isLoading && <BreakdownSkeleton />}

            {/* Un bloque Hero + desglose por cada moneda con movimiento -- normalmente solo
                PEN, pero si hay gastos en $ también (ej. Netflix, compras online) aparecen
                separados, nunca sumados en un solo total sin sentido. */}
            {!isLoading &&
              !isError &&
              data?.currencies.map((currencySummary, index) => (
                <div key={currencySummary.currency} className="space-y-6">
                  <Hero data={currencySummary} />

                  <div className="flex min-h-0 flex-col">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="section-title">
                        Gastos por categoría{data.currencies.length > 1 ? ` · ${currencySummary.currency}` : ''}
                      </h2>
                      {index === 0 && (
                        <Link
                          to="/transactions"
                          className="text-xs font-semibold text-neon-purple hover:brightness-125"
                        >
                          Ver movimientos →
                        </Link>
                      )}
                    </div>
                    <div className="lg:max-h-[calc(100vh-24rem)] lg:overflow-y-auto lg:pr-1">
                      <CategoryBreakdownPanel
                        items={currencySummary.breakdown}
                        currency={currencySummary.currency}
                        accentHex={accentHex}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="space-y-4 lg:sticky lg:top-24">
            <GmailCard gmailStatus={gmailStatus} />
            <InboxBanner inboxAddress={inboxAddress} />
            <PendingSendersList />

            <div className="card card-hover overflow-hidden">
              <Link to="/advisor" className="flex items-center gap-4 p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                  <Sparkles size={22} strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Pregúntale a Luki</p>
                  <p className="text-sm text-off-white/55">
                    “¿En qué se me fue la plata este mes?”
                  </p>
                </div>
                <span className="shrink-0 text-neon-purple">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default Dashboard
