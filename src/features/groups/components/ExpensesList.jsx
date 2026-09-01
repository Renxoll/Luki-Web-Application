import { Receipt } from 'lucide-react'
import { useAuthStore } from '../../../store/useAuthStore'
import { formatMoney } from '../lib/formatMoney'

const dateFormatter = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short' })

export function ExpensesList({ expenses }) {
  const currentUserId = useAuthStore((state) => state.user?.id)

  if (expenses.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 p-8 text-center">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.06] text-off-white/40">
          <Receipt size={18} />
        </span>
        <p className="text-sm text-off-white/55">Todavía no hay gastos registrados en este grupo.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-1.5">
      {expenses.map((expense) => (
        <li key={expense.expenseId} className="card p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{expense.description}</p>
              <p className="mt-0.5 text-xs text-off-white/45">
                {expense.paidByUserId === currentUserId ? 'Tú' : expense.paidByDisplayName} pagó ·{' '}
                {dateFormatter.format(new Date(expense.createdAt))}
              </p>
            </div>
            <p className="shrink-0 text-sm font-bold tabular-nums">{formatMoney(expense.amount, expense.currency)}</p>
          </div>
          <p className="mt-1.5 text-xs text-off-white/40">
            Dividido entre{' '}
            {expense.shares.map((s) => (s.userId === currentUserId ? 'ti' : s.displayName)).join(', ')}
          </p>
        </li>
      ))}
    </ul>
  )
}

export default ExpensesList
