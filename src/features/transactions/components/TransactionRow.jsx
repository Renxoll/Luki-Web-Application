import { Store, ArrowDownLeft, Clock, XCircle, ArrowLeftRight } from 'lucide-react'
import { useUpdateTransactionCategory } from '../api/useUpdateTransactionCategory'
import { useSetInternalTransfer } from '../api/useSetInternalTransfer'
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
  const { mutate: recategorize, isPending: isRecategorizing } = useUpdateTransactionCategory()
  const { mutate: setTransfer, isPending: isSettingTransfer } = useSetInternalTransfer()

  const status = STATUS[transaction.status]
  const isProcessed = transaction.status === 'PROCESSED'
  const isIncome = transaction.type === 'INCOME'
  const isTransfer = !!transaction.internalTransfer
  const canEditCategory = isProcessed && !isIncome && !isTransfer
  const c = categoryColor(transaction.category || transaction.merchant || '')

  return (
    <li className={`card card-hover flex items-center gap-3 p-3.5 ${isTransfer ? 'opacity-60' : ''}`}>
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          isTransfer
            ? 'bg-white/[0.06] text-off-white/50'
            : isIncome
              ? 'bg-emerald-400/15 text-emerald-300'
              : `${c.soft} ${c.text}`
        }`}
      >
        {isTransfer ? (
          <ArrowLeftRight size={18} strokeWidth={2.2} />
        ) : isIncome ? (
          <ArrowDownLeft size={18} strokeWidth={2.2} />
        ) : (
          <Store size={18} strokeWidth={2.2} />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {transaction.merchant || (isIncome ? 'Ingreso' : 'Comercio desconocido')}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-off-white/45">
          {dateFormatter.format(new Date(transaction.createdAt))}
          {status && (
            <>
              <span>·</span>
              <status.icon size={12} className={status.cls} />
              <span className={status.cls}>{status.label}</span>
            </>
          )}
          {!status && isTransfer && (
            <>
              <span>·</span>
              <span className="text-off-white/55">Transferencia propia · no cuenta</span>
            </>
          )}
          {!status && !isTransfer && !isIncome && transaction.category && (
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
          disabled={isRecategorizing}
          onChange={(categoryCode) =>
            recategorize({ transactionId: transaction.transactionId, categoryCode })
          }
        />
      )}

      {isProcessed && (
        <button
          type="button"
          onClick={() =>
            setTransfer({ transactionId: transaction.transactionId, internalTransfer: !isTransfer })
          }
          disabled={isSettingTransfer}
          title={
            isTransfer
              ? 'Volver a contar como movimiento normal'
              : 'Marcar como transferencia entre mis cuentas (no cuenta en el resumen)'
          }
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition disabled:opacity-50 ${
            isTransfer
              ? 'bg-neon-purple/20 text-neon-purple'
              : 'text-off-white/40 hover:bg-white/[0.08] hover:text-off-white/80'
          }`}
          aria-pressed={isTransfer}
        >
          <ArrowLeftRight size={15} strokeWidth={2.3} />
        </button>
      )}

      {isIncome && isProcessed && !isTransfer && (
        <span className="chip shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          Ingreso
        </span>
      )}

      <p
        className={`w-24 shrink-0 text-right text-sm font-bold tabular-nums ${
          isTransfer
            ? 'text-off-white/40 line-through decoration-1'
            : isIncome
              ? 'text-emerald-300'
              : 'text-off-white'
        }`}
      >
        {transaction.amount != null
          ? `${isIncome && !isTransfer ? '+' : ''}${currencyFormatter.format(transaction.amount)}`
          : '—'}
      </p>
    </li>
  )
}

export default TransactionRow
