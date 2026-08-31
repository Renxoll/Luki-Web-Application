import { RefreshCw } from 'lucide-react'
import { useSyncGmail } from '../api/useSyncGmail'

function resultMessage({ transactionsIngested, pendingSendersRegistered }) {
  const parts = []
  if (transactionsIngested > 0) {
    parts.push(`${transactionsIngested} gasto${transactionsIngested > 1 ? 's' : ''} nuevo${transactionsIngested > 1 ? 's' : ''}`)
  }
  if (pendingSendersRegistered > 0) {
    parts.push(`${pendingSendersRegistered} remitente${pendingSendersRegistered > 1 ? 's' : ''} por aprobar`)
  }
  return parts.length > 0 ? `Listo: ${parts.join(' · ')}` : 'Todo al día, sin correos nuevos'
}

/**
 * Botón de refresco manual de gastos + feedback de estado ("sincronizando" / resultado /
 * error). Se usa tal cual en el dashboard y en el panel de cuentas de Gmail.
 */
export function RefreshExpensesButton({ className = '' }) {
  const { mutate, isPending, isError, data, isSuccess } = useSyncGmail()

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => mutate()}
        disabled={isPending}
        aria-busy={isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-off-white/80 transition hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw size={13} strokeWidth={2.4} className={isPending ? 'animate-spin' : ''} />
        {isPending ? 'Sincronizando…' : 'Refrescar gastos'}
      </button>

      {isPending && (
        <p className="mt-1.5 text-xs text-off-white/45">
          Leyendo tu bandeja de Gmail, puede tardar unos segundos…
        </p>
      )}
      {isSuccess && !isPending && (
        <p className="mt-1.5 text-xs text-emerald-400">{resultMessage(data)}</p>
      )}
      {isError && !isPending && (
        <p className="mt-1.5 text-xs text-orange-300">
          No se pudo sincronizar. Inténtalo de nuevo en un momento.
        </p>
      )}
    </div>
  )
}

export default RefreshExpensesButton
