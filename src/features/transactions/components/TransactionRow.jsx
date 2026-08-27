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
  const canEditCategory = transaction.status === 'PROCESSED'

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

      <p className="w-24 shrink-0 text-right font-semibold">
        {transaction.amount != null ? currencyFormatter.format(transaction.amount) : '—'}
      </p>
    </li>
  )
}

export default TransactionRow
