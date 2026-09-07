import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { useSyncGmail } from '../api/useSyncGmail'
import { useGmailConnections } from '../api/useGmailConnections'
import { formatRelativeTime } from '../../../lib/relativeTime'

// El backend ya lee la bandeja solo: un cron externo pega al keep-alive cada ~10 min y el
// job programado (@Scheduled) corre cada ~5 min. Así que al abrir la app NO forzamos una
// lectura salvo que la última haya quedado vieja (STALE_AFTER_MS) -- ahí sí conviene tapar
// el hueco. El cooldown evita repetir al navegar entre pantallas; ambos viven a nivel de
// módulo para sobrevivir a los desmontajes de la navegación client-side.
const AUTO_SYNC_COOLDOWN_MS = 2 * 60 * 1000
const STALE_AFTER_MS = 6 * 60 * 1000
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

function latestSyncedAt(connections) {
  return connections
    ?.map((c) => c.lastSyncedAt)
    .filter(Boolean)
    .sort()
    .at(-1)
}

/**
 * Estado de la lectura de correos + botón de refresco, en una barra. Muestra "Leyendo tu
 * bandeja…" mientras sincroniza y "Última lectura: hace X" (de `lastSyncedAt`) en reposo. Al
 * montarse solo fuerza una lectura si la última quedó vieja (ver arriba): la lectura
 * periódica ya la hace el backend.
 */
export function SyncStatusBar({ autoSync = true, className = '' }) {
  const { data: connections } = useGmailConnections()
  const { mutate, isPending, isSuccess, isError, data } = useSyncGmail()
  const hasConnections = (connections?.length ?? 0) > 0
  const lastSyncedAt = latestSyncedAt(connections)
  const needsReconnect = connections?.some((c) => c.needsReconnect) ?? false
  const allNeedReconnect = hasConnections && connections.every((c) => c.needsReconnect)
  const triggeredRef = useRef(false)

  useEffect(() => {
    if (!autoSync || !hasConnections || allNeedReconnect || triggeredRef.current) return
    if (Date.now() - lastAutoSyncAt < AUTO_SYNC_COOLDOWN_MS) return
    const fresh = lastSyncedAt && Date.now() - new Date(lastSyncedAt).getTime() < STALE_AFTER_MS
    if (fresh) return
    triggeredRef.current = true
    lastAutoSyncAt = Date.now()
    // Si falla, se permite reintentar antes (no se "gasta" el cooldown en un intento fallido).
    mutate(undefined, { onError: () => { lastAutoSyncAt = 0 } })
  }, [autoSync, hasConnections, allNeedReconnect, lastSyncedAt, mutate])

  if (!hasConnections) return null

  if (needsReconnect) {
    return (
      <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-orange-300 ${className}`}>
        <AlertTriangle size={13} className="shrink-0" />
        <span>Una cuenta de Gmail necesita reconectarse para seguir leyendo tus correos.</span>
        <Link to="/gmail-accounts" className="font-semibold underline underline-offset-2">
          Arreglar
        </Link>
      </div>
    )
  }

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
