import { Users } from 'lucide-react'
import { useAcceptInvite } from '../api/useAcceptInvite'
import { useDeclineInvite } from '../api/useDeclineInvite'
import { Button } from '../../../components/Button'

export function GroupInviteCard({ invite }) {
  const { mutate: accept, isPending: isAccepting } = useAcceptInvite()
  const { mutate: decline, isPending: isDeclining } = useDeclineInvite()
  const isBusy = isAccepting || isDeclining

  return (
    <div className="rounded-2xl border border-neon-purple/25 bg-neon-purple/[0.08] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neon-purple/15 text-neon-purple">
          <Users size={18} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-off-white/80">Te invitaron a un grupo:</p>
          <p className="mt-1 truncate font-semibold text-neon-purple">{invite.groupName}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="mint" size="sm" onClick={() => accept(invite.membershipId)} disabled={isBusy} loading={isAccepting}>
          {isAccepting ? 'Aceptando…' : 'Aceptar'}
        </Button>
        <Button variant="subtle" size="sm" onClick={() => decline(invite.membershipId)} disabled={isBusy} loading={isDeclining}>
          {isDeclining ? 'Rechazando…' : 'Rechazar'}
        </Button>
      </div>
    </div>
  )
}

export default GroupInviteCard
