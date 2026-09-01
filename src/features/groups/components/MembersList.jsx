import { useAuthStore } from '../../../store/useAuthStore'
import { MemberAvatar } from './MemberAvatar'
import { formatMoney } from '../lib/formatMoney'

function MemberBalance({ balances }) {
  if (!balances || balances.length === 0) {
    return <span className="text-xs text-off-white/40">Sin gastos</span>
  }
  return (
    <div className="flex flex-col items-end gap-0.5">
      {balances.map((balance) => {
        const isZero = balance.amount === 0
        const isPositive = balance.amount > 0
        return (
          <span
            key={balance.currency}
            className={`text-xs font-semibold ${isZero ? 'text-off-white/40' : isPositive ? 'text-emerald-300' : 'text-rose-300'}`}
          >
            {isZero ? 'Saldado' : isPositive ? `+${formatMoney(balance.amount, balance.currency)}` : `-${formatMoney(-balance.amount, balance.currency)}`}
          </span>
        )
      })}
    </div>
  )
}

export function MembersList({ members }) {
  const currentUserId = useAuthStore((state) => state.user?.id)

  return (
    <div>
      <p className="section-title">Miembros</p>
      <ul className="mt-2 space-y-1.5">
        {members.map((member) => (
          <li key={member.membershipId} className="card flex items-center gap-3 p-3">
            <MemberAvatar name={member.displayName} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {member.userId === currentUserId ? 'Tú' : member.displayName}
              </p>
              {member.status === 'PENDING' && <p className="text-xs text-off-white/40">Invitación pendiente</p>}
            </div>
            {member.status === 'ACCEPTED' && <MemberBalance balances={member.balances} />}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MembersList
