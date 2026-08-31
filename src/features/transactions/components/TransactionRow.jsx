import { Store, ArrowDownLeft, Clock, XCircle } from 'lucide-react'
import { useUpdateTransactionCategory } from '../api/useUpdateTransactionCategory'
import { CategorySelect } from './CategorySelect'
import { categoryColor } from '../../../lib/category'

const currencyFormatter = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
const dateFormatter = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short' })

const STATUS = {
  PROCESSED: null,
  PENDING: { label: 'Procesando…', icon: Clock, cls: 'text-off-white/45' },
  FAILED: { label: 'No se pudo procesar', icon: XCircle, cls: 'text-rose-300/80' },
}

export function TransactionRow({ transaction }) {
  const { mutate, isPending } = useUpdateTransactionCategory()
  const status = STATUS[transaction.status]
  const isIncome = transaction.type === 'INCOME'
  const canEditCategory = transaction.status === 'PROCESSED' && !isIncome
  const c = categoryColor(transaction.category || transaction.merchant || '')

  return (
    <li className="card card-hover flex items-center gap-3 p-3.5">
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          isIncome ? 'bg-emerald-400/15 text-emerald-300' : `${c.soft} ${c.text}`
        }`}
      >
        {isIncome ? <ArrowDownLeft size={18} strokeWidth={2.2} /> : <Store size={18} strokeWidth={2.2} />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {isIncome ? transaction.merchant || 'Ingreso' : transaction.merchant || 'Comercio desconocido'}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-off-white/45">
          {dateFormatter.format(new Date(transaction.createdAt))}
          {status && (
            <>
              <span>·</span>
              <status.icon size={12} className={status.cls} />
              <span className={status.cls}>{status.label}</span>
            </>
          )}
          {!status && !isIncome && transaction.category && (
            <>
              <span>·</span>
              <span className={c.text}>{transaction.category}</span>
            </>
          )}
        </p>
      </div>

      {canEditCategory && (
        <CategorySelect
          value={transaction.categoryCode}
          disabled={isPending}
          onChange={(categoryCode) => mutate({ transactionId: transaction.transactionId, categoryCode })}
        />
      )}

      {isIncome && transaction.status === 'PROCESSED' && (
        <span className="chip shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          Ingreso
        </span>
      )}

      <p
        className={`w-24 shrink-0 text-right text-sm font-bold tabular-nums ${
          isIncome ? 'text-emerald-300' : 'text-off-white'
        }`}
      >
        {transaction.amount != null
          ? `${isIncome ? '+' : ''}${currencyFormatter.format(transaction.amount)}`
          : '—'}
      </p>
    </li>
  )
}

export default TransactionRow
