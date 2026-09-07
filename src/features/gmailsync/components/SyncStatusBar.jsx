import { useEffect, useRef } from 'react'
import { RefreshCw } from 'lucide-react'
import { useSyncGmail } from '../api/useSyncGmail'
import { useGmailConnections } from '../api/useGmailConnections'
import { formatRelativeTime } from '../../../lib/relativeTime'

// Cooldown del auto-sync: navegar entre Dashboard y Movimientos no debe volver a leer la
// bandeja cada vez. Vive a nivel de módulo (no de componente) para que sobreviva a los
// desmontajes de la navegación client-side.
const AUTO_SYNC_COOLDOWN_MS = 2 * 60 * 1000
let lastAutoSyncAt = 0

function resultMessage({ transactionsIngested, pendingSendersRegistered }) {
  const parts = []
  if (transactionsIngested > 0) {
    parts.push(`${transactionsIngested} gasto${transactionsIngested > 1 ? 's' : ''} nuevo${transactionsIngested > 1 ? 's' : ''}`)
  }
  if (pendingSendersRegistered > 0) {
    parts.push(`${pendingSendersRegistered} remitente${pendingSendersRegistered > 1 ? 's' : ''} por aprobar`)
  }
  return parts.length > 0 ? parts.join(' · ') : 'Sin correos nuevos'
}

/**
 * Estado de la lectura de correos + botón de refresco, en una sola barra. Al montarse
 * dispara una lectura automática (si hay alguna cuenta de Gmail y pasó el cooldown): en el
 * plan free de Render el job programado no corre con el server dormido, así que abrir la app
 * es lo que la despierta y sincroniza. Mientras lee muestra "Leyendo tu bandeja…"; en reposo,
 * "Última lectura: hace X" a partir del `lastSyncedAt` de las conexiones.
 */
export function SyncStatusBar({ autoSync = true, className = '' }) {
  const { data: connections } = useGmailConnections()
  const { mutate, isPending, isSuccess, isError, data } = useSyncGmail()
  const hasConnections = (connections?.length ?? 0) > 0
  const triggeredRef = useRef(false)

  useEffect(() => {
    if (!autoSync || !hasConnections || triggeredRef.current) return
    if (Date.now() - lastAutoSyncAt < AUTO_SYNC_COOLDOWN_MS) return
    triggeredRef.current = true
    lastAutoSyncAt = Date.now()
    // Si falla, se permite reintentar antes (no se "gasta" el cooldown en un intento fallido).
    mutate(undefined, { onError: () => { lastAutoSyncAt = 0 } })
  }, [autoSync, hasConnections, mutate])

  if (!hasConnections) return null

  const lastSyncedAt = connections
    .map((c) => c.lastSyncedAt)
    .filter(Boolean)
    .sort()
    .at(-1)

  const showResult = isSuccess && !isPending
  const status = isPending
    ? 'Leyendo tu bandeja de Gmail…'
    : isError
      ? 'No se pudo sincronizar. Reintenta en un momento.'
      : showResult
        ? `Listo: ${resultMessage(data)}`
        : lastSyncedAt
          ? `Última lectura: ${formatRelativeTime(lastSyncedAt)}`
          : 'Aún sin leer tu bandeja'

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
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
      <span
        className={`text-xs ${
          isPending
            ? 'text-off-white/55'
            : isError
              ? 'text-orange-300'
              : showResult
                ? 'text-emerald-400'
                : 'text-off-white/45'
        }`}
      >
        {status}
      </span>
    </div>
  )
}

export default SyncStatusBar
