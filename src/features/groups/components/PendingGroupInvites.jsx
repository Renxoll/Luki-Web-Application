import { useMyPendingInvites } from '../api/useMyPendingInvites'
import { GroupInviteCard } from './GroupInviteCard'

export function PendingGroupInvites() {
  const { data: invites, isLoading, isError } = useMyPendingInvites()

  // Sin loading/error skeletons a propósito: mismo criterio que PendingSendersList -- es
  // una sección secundaria, si falla o carga simplemente no se muestra nada todavía.
  if (isLoading || isError || !invites || invites.length === 0) {
    return null
  }

  return (
    <div className="mb-5 space-y-3">
      {invites.map((invite) => (
        <GroupInviteCard key={invite.membershipId} invite={invite} />
      ))}
    </div>
  )
}

export default PendingGroupInvites
