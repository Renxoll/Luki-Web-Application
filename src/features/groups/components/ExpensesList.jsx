import { useState } from 'react'
import { Pencil, Receipt } from 'lucide-react'
import { useAuthStore } from '../../../store/useAuthStore'
import { formatMoney } from '../lib/formatMoney'
import { EditExpenseForm } from './EditExpenseForm'

const dateFormatter = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short' })

export function ExpensesList({ expenses, groupId, ownerId, members }) {
  const currentUserId = useAuthStore((state) => state.user?.id)
  const [editingExpenseId, setEditingExpenseId] = useState(null)

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

  const editingExpense = expenses.find((e) => e.expenseId === editingExpenseId)

  return (
    <>
      <ul className="space-y-1.5">
        {expenses.map((expense) => {
          const canEdit = expense.paidByUserId === currentUserId || ownerId === currentUserId
          return (
            <li key={expense.expenseId} className="card p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{expense.description}</p>
                  <p className="mt-0.5 text-xs text-off-white/45">
                    {expense.paidByUserId === currentUserId ? 'Tú' : expense.paidByDisplayName} pagó ·{' '}
                    {dateFormatter.format(new Date(expense.createdAt))}
                    {expense.updatedAt && ' · editado'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="text-sm font-bold tabular-nums">{formatMoney(expense.amount, expense.currency)}</p>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => setEditingExpenseId(expense.expenseId)}
                      className="rounded-lg p-1.5 text-off-white/40 transition hover:bg-white/5 hover:text-off-white"
                      aria-label={`Corregir ${expense.description}`}
                    >
                      <Pencil size={14} strokeWidth={2.2} />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1.5 text-xs text-off-white/40">
                Dividido entre{' '}
                {expense.shares.map((s) => (s.userId === currentUserId ? 'ti' : s.displayName)).join(', ')}
              </p>
            </li>
          )
        })}
      </ul>

      {editingExpense && (
        <EditExpenseForm
          groupId={groupId}
          expense={editingExpense}
          members={members}
          onClose={() => setEditingExpenseId(null)}
        />
      )}
    </>
  )
}

export default ExpensesList
