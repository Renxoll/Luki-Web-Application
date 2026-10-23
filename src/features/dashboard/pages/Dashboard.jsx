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
import { SyncStatusBar } from '../../gmailsync/components/SyncStatusBar'
import { PendingSendersList } from '../../pendingSenders/components/PendingSendersList'
import { useAuthStore } from '../../../store/useAuthStore'
import { AppShell } from '../../../components/AppShell'
import { WorkspaceSwitcher } from '../../workspaces/components/WorkspaceSwitcher'
import { useActiveWorkspace } from '../../workspaces/api/useActiveWorkspace'
import { CategoryBreakdownPanel } from '../../analytics/components/CategoryBreakdownPanel'
import { useIsDesktop } from '../../../lib/useMediaQuery'

// A diferencia de antes, la moneda ya no es siempre PEN -- el dashboard ahora puede traer
// un CurrencySummary por cada moneda con movimiento (ver useMonthlySummary), así que el
// formatter se arma por llamada en vez de ser una constante fija a PEN.
function formatCurrency(amount, currency = 'PEN') {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount ?? 0)
}

function InboxBanner({ inboxAddress, compact = false }) {
  if (!inboxAddress) return null
  if (compact) {
    return (
      <div className="card flex items-center gap-2.5 px-3 py-2">
        <Inbox size={15} strokeWidth={2.2} className="shrink-0 text-neon-purple" />
        <p className="min-w-0 flex-1 truncate text-xs text-off-white/60">
          Reenvía tus avisos a <span className="font-mono font-semibold text-neon-purple">{inboxAddress}</span>
        </p>
      </div>
    )
  }
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

function GmailCard({ gmailStatus, compact = false }) {
  const { data: connections } = useGmailConnections()
  const count = connections?.length ?? 0

  const flash = (
    <>
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
    </>
  )

  if (compact) {
    // Una sola línea en la tira de acciones del celular: el estado largo y la barra de
    // sincronización quedan para la pantalla de cuentas de Gmail.
    return (
      <>
        <Link to="/gmail-accounts" className="card card-hover flex min-w-0 items-center gap-2.5 px-3 py-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-electric-mint/15 text-electric-mint">
            <Mail size={16} strokeWidth={2.2} />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold">Gmail</span>
            <span className="block truncate text-xs text-off-white/55">
              {count > 0 ? `${count} cuenta${count > 1 ? 's' : ''}` : 'Conectar'}
            </span>
          </span>
        </Link>
        {flash && <div className="col-span-2 empty:hidden">{flash}</div>}
      </>
    )
  }

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

      {count > 0 && <SyncStatusBar className="px-1" />}

      {flash}
    </div>
  )
}

function HeroSkeleton() {
  return <div className="h-32 animate-pulse rounded-2xl bg-white/[0.05]" />
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
    <div className="relative shrink-0 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 shadow-card backdrop-blur-sm sm:p-5 lg:p-4">
      <div className="absolute inset-0 -z-10 bg-brand-fade" />
      <div className="absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-neon-purple/25 blur-3xl" />

      <p className="section-title">Balance neto de este mes {data.currency !== 'PEN' && `(${data.currency})`}</p>
      <p
        className={`mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          positive ? 'text-off-white' : 'text-rose-300'
        }`}
      >
        {positive ? '' : '−'}
        {formatCurrency(Math.abs(net), data.currency)}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
        <span className="chip min-w-0 justify-center sm:justify-start">
          <ArrowDownRight size={13} className="text-emerald-400" />
          Ingresos {formatCurrency(data.totalIncome, data.currency)}
        </span>
        <span className="chip min-w-0 justify-center sm:justify-start">
          <ArrowUpRight size={13} className="text-orange-400" />
          Gastos {formatCurrency(data.totalSpent, data.currency)}
        </span>
        {variation != null && (
          <span
            className={`chip col-span-2 [@media(max-height:700px)]:max-sm:hidden ${
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

function AdvisorCard({ compact = false }) {
  if (compact) {
    return (
      <Link to="/advisor" className="card card-hover flex min-w-0 items-center gap-2.5 px-3 py-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">
          <Sparkles size={16} strokeWidth={2.2} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold">Luki AI</span>
          <span className="block truncate text-xs text-off-white/55">Pregúntale</span>
        </span>
      </Link>
    )
  }
  return (
    <div className="card card-hover overflow-hidden">
      <Link to="/advisor" className="flex items-center gap-4 p-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
          <Sparkles size={22} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Pregúntale a Luki</p>
          <p className="text-sm text-off-white/55">“¿En qué se me fue la plata este mes?”</p>
        </div>
        <span className="shrink-0 text-neon-purple">→</span>
      </Link>
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
  // Fuera de escritorio las tarjetas secundarias pasan a una tira compacta para que todo entre
  // en una pantalla.
  const compact = !useIsDesktop()

  const displayName =
    user?.name || user?.displayName || (user?.email || '').split('@')[0]
  const accentHex = workspace?.colorHex || '#8B5CF6'

  return (
    <AppShell maxWidth="max-w-6xl" fit="all">
      <div className="animate-fade-up flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 [@media(max-height:700px)]:max-sm:hidden">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Hola{displayName ? `, ${displayName}` : ''}
          </h1>
          <p className="mt-1 hidden text-sm text-off-white/55 sm:block">
            {workspace && !workspace.isDefault
              ? `El pulso del módulo “${workspace.name}”.`
              : 'Este es el pulso de tu mes.'}
          </p>
        </div>

        <WorkspaceSwitcher className="mt-2 shrink-0 sm:mt-4 lg:mt-3" />

        {/* Una sola pantalla en cualquier tamaño, sin scroll de página: el resumen reparte el alto
            disponible y el desglose por categoría mide cuántas filas le caben. Escritorio: dos
            columnas. Celular y tablet: una columna, con las acciones en una tira compacta abajo. */}
        <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3 lg:mt-4 lg:grid lg:grid-cols-3 lg:grid-rows-1 lg:gap-5">
          <div className="flex min-h-0 flex-1 flex-col gap-3 lg:col-span-2 lg:gap-4">
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
                <div key={currencySummary.currency} className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-3">
                  <Hero data={currencySummary} />

                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="mb-2 flex shrink-0 items-center justify-between">
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
                    <div className="min-h-0 flex-1">
                      <CategoryBreakdownPanel
                        items={currencySummary.breakdown}
                        currency={currencySummary.currency}
                        accentHex={accentHex}
                        fit
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div
            className={
              compact ? 'grid shrink-0 grid-cols-2 gap-2' : 'min-h-0 space-y-3 overflow-y-auto'
            }
          >
            <GmailCard gmailStatus={gmailStatus} compact={compact} />
            <AdvisorCard compact={compact} />
            <div className={compact ? 'col-span-2 empty:hidden' : 'contents'}>
              <InboxBanner inboxAddress={inboxAddress} compact={compact} />
              <PendingSendersList />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default Dashboard
