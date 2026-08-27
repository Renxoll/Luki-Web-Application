import { useApproveSender } from '../api/useApproveSender'
import { useRejectSender } from '../api/useRejectSender'

export function PendingSenderCard({ pendingSender }) {
  const { mutate: approve, isPending: isApproving } = useApproveSender()
  const { mutate: reject, isPending: isRejecting } = useRejectSender()
  const isBusy = isApproving || isRejecting

  return (
    <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
      <p className="text-sm text-off-white/80">
        Nos llegó un correo de un remitente que no reconocemos:
      </p>
      <p className="mt-1 font-mono text-sm font-semibold text-amber-300">{pendingSender.domain}</p>
      {pendingSender.sampleSnippet && (
        <p className="mt-2 line-clamp-2 text-xs text-off-white/50">{pendingSender.sampleSnippet}</p>
      )}
      <p className="mt-1 text-xs text-off-white/40">
        {pendingSender.occurrenceCount} correo{pendingSender.occurrenceCount === 1 ? '' : 's'} recibido
        {pendingSender.occurrenceCount === 1 ? '' : 's'}
      </p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => approve(pendingSender.pendingSenderId)}
          disabled={isBusy}
          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isApproving ? 'Aprobando...' : 'Confiar en este remitente'}
        </button>
        <button
          type="button"
          onClick={() => reject(pendingSender.pendingSenderId)}
          disabled={isBusy}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-off-white/80 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRejecting ? 'Rechazando...' : 'No es un gasto'}
        </button>
      </div>
    </div>
  )
}

export default PendingSenderCard
