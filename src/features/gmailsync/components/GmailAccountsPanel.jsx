import { useConnectGmail } from '../api/useConnectGmail'
import { useDisconnectGmail } from '../api/useDisconnectGmail'
import { useGmailConnections } from '../api/useGmailConnections'

const dateFormatter = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })

function formatDate(value) {
  return value ? dateFormatter.format(new Date(value)) : null
}

function GmailAccountRow({ connection }) {
  const { mutate: disconnect, isPending } = useDisconnectGmail()

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-4">
      <div className="min-w-0">
        <p className="truncate font-medium">{connection.email ?? 'Cuenta sin verificar'}</p>
        <p className="text-xs text-off-white/50">
          Conectada el {formatDate(connection.connectedAt)}
          {connection.lastSyncedAt ? ` · última sincronización ${formatDate(connection.lastSyncedAt)}` : ''}
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

      {!isLoading && !isError && connections && connections.length > 0 && (
        <ul className="space-y-2">
          {connections.map((connection) => (
            <GmailAccountRow key={connection.id} connection={connection} />
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => connect()}
        disabled={isConnecting}
        className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isConnecting ? 'Conectando...' : connections && connections.length > 0 ? 'Conectar otra cuenta' : 'Conectar Gmail'}
      </button>
    </div>
  )
}

export default GmailAccountsPanel
