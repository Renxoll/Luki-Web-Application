import { useUpdateTransactionCategory } from '../api/useUpdateTransactionCategory'
import { CategorySelect } from './CategorySelect'

const currencyFormatter = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
const dateFormatter = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short' })

const STATUS_LABEL = {
  PROCESSED: null,
  PENDING: 'Procesando...',
  FAILED: 'No se pudo procesar',
}

export function TransactionRow({ transaction }) {
  const { mutate, isPending } = useUpdateTransactionCategory()
  const statusLabel = STATUS_LABEL[transaction.status]
  const isIncome = transaction.type === 'INCOME'
  const canEditCategory = transaction.status === 'PROCESSED' && !isIncome

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{transaction.merchant ?? 'Comercio desconocido'}</p>
        <p className="text-xs text-off-white/50">
          {dateFormatter.format(new Date(transaction.createdAt))}
          {statusLabel ? ` · ${statusLabel}` : ''}
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
        <span className="shrink-0 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
          Ingreso
        </span>
      )}

      <p className={`w-24 shrink-0 text-right font-semibold ${isIncome ? 'text-emerald-400' : ''}`}>
        {transaction.amount != null
          ? `${isIncome ? '+' : ''}${currencyFormatter.format(transaction.amount)}`
          : '—'}
      </p>
    </li>
  )
}

export default TransactionRow
