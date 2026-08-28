import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMonthlySummary } from '../../analytics/api/useMonthlySummary'
import { useGmailConnections } from '../../gmailsync/api/useGmailConnections'
import { PendingSendersList } from '../../pendingSenders/components/PendingSendersList'
import { useAuthStore } from '../../../store/useAuthStore'

const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
})

function formatCurrency(value) {
  return currencyFormatter.format(value ?? 0)
}

function BalanceCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white/5 p-6 shadow-xl">
      <div className="h-4 w-32 rounded bg-white/10" />
      <div className="mt-4 h-9 w-48 rounded bg-white/10" />
      <div className="mt-3 h-4 w-24 rounded bg-white/10" />
    </div>
  )
}

function InboxBanner({ inboxAddress }) {
  if (!inboxAddress) return null

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-neon-purple/30 bg-neon-purple/10 p-4">
      <span className="mt-0.5 text-lg text-neon-purple">✉️</span>
      <div>
        <p className="text-sm text-off-white/80">
          Para registrar un gasto, reenvía tus notificaciones bancarias a:
        </p>
        <p className="mt-1 font-mono text-sm font-semibold text-neon-purple">
          {inboxAddress}
        </p>
      </div>
    </div>
  )
}

function GmailConnectionsSummary({ gmailStatus }) {
  const { data: connections } = useGmailConnections()
  const navigate = useNavigate()
  const count = connections?.length ?? 0

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => navigate('/gmail-accounts')}
        className="flex w-full items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-left transition hover:brightness-110"
      >
        <span className="flex items-center gap-2 text-sm text-off-white/80">
          <span className="text-lg">📧</span>
          {count > 0
            ? `${count} cuenta${count > 1 ? 's' : ''} de Gmail conectada${count > 1 ? 's' : ''}`
            : 'Conecta tu Gmail para que Luki lea tus notificaciones bancarias solo'}
        </span>
        <span className="shrink-0 text-xs font-medium text-emerald-400">Gestionar →</span>
      </button>

      {/* Confirmación inmediata post-redirect de Google -- el conteo de arriba ya no
          depende de esto (se refetchea solo), es solo un toast momentáneo. */}
      {gmailStatus === 'connected' && (
        <div className="mt-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
          Tu Gmail quedó conectado. Los próximos correos bancarios se procesan solos.
        </div>
      )}
      {gmailStatus === 'error' && (
        <div className="mt-2 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-3 text-sm text-orange-300">
          No se pudo conectar tu Gmail. Intenta de nuevo.
        </div>
      )}
    </div>
  )
}

function BreakdownSkeleton() {
  return (
    <div className="mt-6 space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center justify-between rounded-xl bg-white/5 p-4"
        >
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="h-4 w-16 rounded bg-white/10" />
        </div>
      ))}
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const inboxAddress = useAuthStore((state) => state.inboxAddress)
  const { data, isLoading, isError, error } = useMonthlySummary()
  const gmailStatus = searchParams.get('gmail')

  const variation =
    data && data.previousMonthTotal > 0
      ? ((data.totalSpent - data.previousMonthTotal) / data.previousMonthTotal) * 100
      : 0
  const hasIncreased = variation > 0
  const variationColor = hasIncreased ? 'text-orange-400' : 'text-emerald-500'
  const variationSign = hasIncreased ? '+' : ''

  return (
    <div className="min-h-screen bg-midnight px-4 py-8 text-off-white sm:px-8">
      <div className="mx-auto max-w-2xl">
        <InboxBanner inboxAddress={inboxAddress} />
        <GmailConnectionsSummary gmailStatus={gmailStatus} />
        <PendingSendersList />

        <h1 className="mt-6 text-xl font-semibold text-off-white/80">Resumen del mes</h1>

        {isLoading && <div className="mt-4"><BalanceCardSkeleton /></div>}

        {isError && (
          <div className="mt-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-6">
            <p className="font-medium text-orange-300">No pudimos cargar tu resumen</p>
            <p className="mt-1 text-sm text-off-white/60">
              {error?.message || 'Inténtalo de nuevo en unos minutos.'}
            </p>
          </div>
        )}

        {!isLoading && !isError && data && (
          <div className="mt-4 rounded-2xl bg-white/5 p-6 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-off-white/60">Ingresos</p>
                <p className="mt-1 text-2xl font-bold text-emerald-400">
                  {formatCurrency(data.totalIncome)}
                </p>
              </div>
              <div>
                <p className="text-sm text-off-white/60">Gastos</p>
                <p className="mt-1 text-2xl font-bold text-orange-400">
                  {formatCurrency(data.totalSpent)}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3">
              <p className="text-sm text-off-white/60">Balance neto</p>
              <p
                className={`mt-1 text-xl font-semibold ${
                  data.totalIncome - data.totalSpent >= 0 ? 'text-emerald-400' : 'text-orange-400'
                }`}
              >
                {formatCurrency(data.totalIncome - data.totalSpent)}
              </p>
            </div>
            <p className={`mt-3 text-xs font-medium ${variationColor}`}>
              {variationSign}
              {variation.toFixed(1)}% de gasto vs. mes anterior
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-off-white/50">
            Gastos por categoría
          </h2>
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="text-xs font-medium text-neon-purple transition hover:brightness-110"
          >
            Ver todas las transacciones →
          </button>
        </div>

        {isLoading && <BreakdownSkeleton />}

        {!isLoading && !isError && data && (
          <ul className="mt-4 space-y-2">
            {data.breakdown.map((item) => (
              <li
                key={item.categoryId}
                className="flex items-center justify-between rounded-xl bg-white/5 p-4"
              >
                <div>
                  <p className="font-medium">{item.categoryName}</p>
                  <p className="text-xs text-off-white/50">
                    {item.percentage.toFixed(1)}% del total
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(item.amount)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate('/advisor')}
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-neon-purple px-5 py-3 font-medium text-off-white shadow-lg shadow-neon-purple/30 transition hover:brightness-110"
      >
        Pregúntale a Luki
      </button>
    </div>
  )
}

export default Dashboard
