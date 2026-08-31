import { MailQuestion } from 'lucide-react'
import { useApproveSender } from '../api/useApproveSender'
import { useRejectSender } from '../api/useRejectSender'
import { Button } from '../../../components/Button'

export function PendingSenderCard({ pendingSender }) {
  const { mutate: approve, isPending: isApproving } = useApproveSender()
  const { mutate: reject, isPending: isRejecting } = useRejectSender()
  const isBusy = isApproving || isRejecting

  return (
    <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.08] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-400/15 text-amber-300">
          <MailQuestion size={18} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-off-white/80">Nos llegó un correo de un remitente que no reconocemos:</p>
          <p className="mt-1 break-all font-mono text-sm font-semibold text-amber-300">{pendingSender.domain}</p>
          {pendingSender.sampleSnippet && (
            <p className="mt-2 line-clamp-2 text-xs text-off-white/45">{pendingSender.sampleSnippet}</p>
          )}
          <p className="mt-1 text-xs text-off-white/35">
            {pendingSender.occurrenceCount} correo{pendingSender.occurrenceCount === 1 ? '' : 's'} recibido
            {pendingSender.occurrenceCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="mint"
          size="sm"
          onClick={() => approve(pendingSender.pendingSenderId)}
          disabled={isBusy}
          loading={isApproving}
        >
          {isApproving ? 'Aprobando…' : 'Confiar en este remitente'}
        </Button>
        <Button
          variant="subtle"
          size="sm"
          onClick={() => reject(pendingSender.pendingSenderId)}
          disabled={isBusy}
          loading={isRejecting}
        >
          {isRejecting ? 'Rechazando…' : 'No es un gasto'}
        </Button>
      </div>
    </div>
  )
}

export default PendingSenderCard
