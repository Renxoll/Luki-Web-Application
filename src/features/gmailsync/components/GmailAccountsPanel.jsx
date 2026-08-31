import { useConnectGmail } from '../api/useConnectGmail'
import { useDisconnectGmail } from '../api/useDisconnectGmail'
import { useGmailConnections } from '../api/useGmailConnections'
import { useSyncGmail } from '../api/useSyncGmail'

const dateFormatter = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })

function formatDate(value) {
  return value ? dateFormatter.format(new Date(value)) : null
}

function formatRelative(value) {
  if (!value) return null
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000)
  if (minutes < 1) return 'hace un momento'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  if (days === 1) return 'ayer'
  if (days < 30) return `hace ${days} días`
  return formatDate(value)
}

function syncResultMessage({ transactionsIngested, pendingSendersRegistered }) {
  const parts = []
  if (transactionsIngested > 0) {
    parts.push(`${transactionsIngested} gasto${transactionsIngested > 1 ? 's' : ''} nuevo${transactionsIngested > 1 ? 's' : ''}`)
  }
  if (pendingSendersRegistered > 0) {
    parts.push(`${pendingSendersRegistered} remitente${pendingSendersRegistered > 1 ? 's' : ''} por aprobar`)
  }
  return parts.length > 0 ? `Listo: ${parts.join(' · ')}` : 'Todo al día, sin correos nuevos'
}

function GmailAccountRow({ connection, isSyncing }) {
  const { mutate: disconnect, isPending } = useDisconnectGmail()

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-4">
      <div className="min-w-0">
        <p className="truncate font-medium">{connection.email ?? 'Cuenta sin verificar'}</p>
        <p className="text-xs text-off-white/50">Conectada el {formatDate(connection.connectedAt)}</p>
        <p className="mt-0.5 text-xs">
          {isSyncing ? (
            <span className="text-emerald-400">
              <span className="inline-block animate-spin">🔄</span> Sincronizando datos…
            </span>
          ) : connection.lastSyncedAt ? (
            <span className="text-off-white/50">Última lectura {formatRelative(connection.lastSyncedAt)}</span>
          ) : (
            <span className="text-off-white/40">Sin lecturas todavía</span>
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={() => disconnect(connection.id)}
        disabled={isPending}
        className="shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-off-white/80 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Desconectando...' : 'Desconectar'}
      </button>
    </li>
  )
}

export function GmailAccountsPanel() {
  const { data: connections, isLoading, isError, error } = useGmailConnections()
  const { mutate: connect, isPending: isConnecting } = useConnectGmail()
  const { mutate: sync, isPending: isSyncing, isSuccess: syncDone, isError: syncFailed, data: syncData } = useSyncGmail()

  const hasConnections = !isLoading && !isError && connections && connections.length > 0

  return (
    <div className="mt-4">
      {isLoading && (
        <div className="animate-pulse rounded-2xl bg-white/5 p-6">
          <div className="h-4 w-40 rounded bg-white/10" />
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 p-6">
          <p className="font-medium text-orange-300">No pudimos cargar tus cuentas conectadas</p>
          <p className="mt-1 text-sm text-off-white/60">{error?.message || 'Inténtalo de nuevo en unos minutos.'}</p>
        </div>
      )}

      {!isLoading && !isError && connections && connections.length === 0 && (
        <div className="rounded-2xl bg-white/5 p-6 text-center text-sm text-off-white/60">
          Todavía no conectaste ninguna cuenta de Gmail.
        </div>
      )}

      {hasConnections && (
        <>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs text-off-white/50">
              Luki lee tu bandeja automáticamente cada pocos minutos. El botón fuerza una lectura ahora.
            </p>
            <button
              type="button"
              onClick={() => sync()}
              disabled={isSyncing}
              aria-busy={isSyncing}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-off-white/80 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className={isSyncing ? 'inline-block animate-spin' : ''}>🔄</span>
              {isSyncing ? 'Sincronizando…' : 'Refrescar gastos'}
            </button>
          </div>

          {syncDone && !isSyncing && <p className="mb-2 text-xs text-emerald-400">{syncResultMessage(syncData)}</p>}
          {syncFailed && !isSyncing && (
            <p className="mb-2 text-xs text-orange-300">No se pudo sincronizar. Inténtalo de nuevo en un momento.</p>
          )}

          <ul className="space-y-2">
            {connections.map((connection) => (
              <GmailAccountRow key={connection.id} connection={connection} isSyncing={isSyncing} />
            ))}
          </ul>
        </>
      )}

      <button
        type="button"
        onClick={() => connect()}
        disabled={isConnecting}
        className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isConnecting ? 'Conectando...' : hasConnections ? 'Conectar otra cuenta' : 'Conectar Gmail'}
      </button>
    </div>
  )
}

export default GmailAccountsPanel
