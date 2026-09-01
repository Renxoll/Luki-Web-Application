import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { formatMoney } from '../lib/formatMoney'

function BalanceLine({ balance }) {
  const isPositive = balance.amount > 0
  const isZero = balance.amount === 0
  return (
    <span
      key={balance.currency}
      className={`text-sm font-semibold ${isZero ? 'text-off-white/45' : isPositive ? 'text-emerald-300' : 'text-rose-300'}`}
    >
      {isZero ? 'Saldado' : isPositive ? `Te deben ${formatMoney(balance.amount, balance.currency)}` : `Debes ${formatMoney(-balance.amount, balance.currency)}`}
    </span>
  )
}

export function GroupCard({ group }) {
  return (
    <Link to={`/groups/${group.groupId}`} className="card card-hover flex items-center gap-3 p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neon-purple/15 text-neon-purple">
        <Users size={18} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{group.name}</p>
        <p className="mt-0.5 text-xs text-off-white/45">
          {group.memberCount} miembro{group.memberCount === 1 ? '' : 's'}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        {group.yourBalances.length === 0 ? (
          <span className="text-sm text-off-white/45">Sin gastos</span>
        ) : (
          group.yourBalances.map((balance) => <BalanceLine key={balance.currency} balance={balance} />)
        )}
      </div>
    </Link>
  )
}

export default GroupCard
