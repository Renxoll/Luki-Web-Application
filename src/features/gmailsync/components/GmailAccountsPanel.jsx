import { Mail, RefreshCw, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react'
import { useConnectGmail } from '../api/useConnectGmail'
import { useDisconnectGmail } from '../api/useDisconnectGmail'
import { useGmailConnections } from '../api/useGmailConnections'
import { useSyncGmail } from '../api/useSyncGmail'
import { Button } from '../../../components/Button'
import { formatShortDate, formatRelativeTime } from '../../../lib/relativeTime'

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
  const { mutate: reconnect, isPending: isReconnecting } = useConnectGmail()
  const needsReconnect = connection.needsReconnect

  return (
    <li className={`card flex items-center gap-3 p-4 ${needsReconnect ? 'border-orange-400/30' : ''}`}>
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          needsReconnect ? 'bg-orange-400/15 text-orange-300' : 'bg-electric-mint/15 text-electric-mint'
        }`}
      >
        <Mail size={18} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{connection.email ?? 'Cuenta sin verificar'}</p>
        <p className="mt-0.5 text-xs text-off-white/45">Conectada el {formatShortDate(connection.connectedAt)}</p>
        <p className="mt-1 text-xs">
          {needsReconnect ? (
            <span className="inline-flex items-center gap-1.5 text-orange-300">
              <AlertTriangle size={12} /> El permiso caducó — reconéctala para seguir leyendo tus correos
            </span>
          ) : isSyncing ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <Loader2 size={12} className="animate-spin" /> Sincronizando datos…
            </span>
          ) : connection.lastSyncedAt ? (
            <span className="text-off-white/45">Última lectura {formatRelativeTime(connection.lastSyncedAt)}</span>
          ) : (
            <span className="text-off-white/35">Sin lecturas todavía</span>
          )}
        </p>
      </div>
      {needsReconnect && (
        <Button variant="mint" size="sm" onClick={() => reconnect()} loading={isReconnecting} className="shrink-0">
          {isReconnecting ? 'Abriendo…' : 'Reconectar'}
        </Button>
      )}
      <Button
        variant="subtle"
        size="sm"
        onClick={() => disconnect(connection.id)}
        loading={isPending}
        className="shrink-0"
      >
        {isPending ? 'Desconectando…' : 'Desconectar'}
      </Button>
    </li>
  )
}

export function GmailAccountsPanel() {
  const { data: connections, isLoading, isError, error } = useGmailConnections()
  const { mutate: connect, isPending: isConnecting } = useConnectGmail()
  const { mutate: sync, isPending: isSyncing, isSuccess: syncDone, isError: syncFailed, data: syncData } = useSyncGmail()

  const hasConnections = !isLoading && !isError && connections && connections.length > 0

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="card animate-pulse p-6">
          <div className="h-4 w-40 rounded bg-white/10" />
        </div>
      )}

      {isError && (
        <div className="card border-orange-400/25 bg-orange-400/10 p-6">
          <p className="font-semibold text-orange-300">No pudimos cargar tus cuentas conectadas</p>
          <p className="mt-1 text-sm text-off-white/60">{error?.message || 'Inténtalo de nuevo en unos minutos.'}</p>
        </div>
      )}

      {!isLoading && !isError && connections && connections.length === 0 && (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-electric-mint/15 text-electric-mint">
            <Mail size={22} />
          </span>
          <p className="text-sm text-off-white/55">
            Conecta tu Gmail y Luki empezará a leer tus notificaciones bancarias solo.
          </p>
        </div>
      )}

      {hasConnections && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-xs text-xs text-off-white/45">
              Luki lee tu bandeja automáticamente cada pocos minutos. El botón fuerza una lectura ahora.
            </p>
            <Button
              variant="subtle"
              size="sm"
              icon={RefreshCw}
              onClick={() => sync()}
              loading={isSyncing}
            >
              {isSyncing ? 'Sincronizando…' : 'Refrescar gastos'}
            </Button>
          </div>

          {syncDone && !isSyncing && <p className="text-xs text-emerald-400">{syncResultMessage(syncData)}</p>}
          {syncFailed && !isSyncing && (
            <p className="text-xs text-orange-300">No se pudo sincronizar. Inténtalo de nuevo en un momento.</p>
          )}

          <ul className="space-y-2">
            {connections.map((connection) => (
              <GmailAccountRow key={connection.id} connection={connection} isSyncing={isSyncing} />
            ))}
          </ul>
        </>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button variant="mint" onClick={() => connect()} loading={isConnecting}>
          {isConnecting ? 'Conectando…' : hasConnections ? 'Conectar otra cuenta' : 'Conectar Gmail'}
        </Button>
        <span className="inline-flex items-center gap-1.5 text-xs text-off-white/40">
          <ShieldCheck size={13} /> Acceso de solo lectura
        </span>
      </div>
    </div>
  )
}

export default GmailAccountsPanel
