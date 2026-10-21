import { useState } from 'react'
import { Store, ArrowDownLeft, Clock, XCircle, ArrowLeftRight, PencilLine } from 'lucide-react'
import { useUpdateTransactionCategory } from '../api/useUpdateTransactionCategory'
import { useSetInternalTransfer } from '../api/useSetInternalTransfer'
import { CategorySelect } from './CategorySelect'
import { MoveTransactionMenu } from './MoveTransactionMenu'
import { CompleteExpenseModal } from './CompleteExpenseModal'
import { isUnknownMerchant, needsManualDetails } from '../lib/unknownMerchant'
import { categoryColor } from '../../../lib/category'

const dateFormatter = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short' })

// Cada transacción trae su propia moneda (no todo es PEN -- ej. un cargo de Netflix en $)
// así que el formatter se arma por fila en vez de fijarse a PEN.
function formatAmount(amount, currency) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: currency || 'PEN' }).format(amount)
}

const STATUS = {
  PROCESSED: null,
  PENDING: { label: 'Procesando…', icon: Clock, cls: 'text-off-white/45' },
  FAILED: { label: 'No se pudo procesar', icon: XCircle, cls: 'text-rose-300/80' },
}

export function TransactionRow({ transaction, workspaces = [], categoryOptions }) {
  const { mutate: recategorize, isPending: isRecategorizing } = useUpdateTransactionCategory()
  const { mutate: setTransfer, isPending: isSettingTransfer } = useSetInternalTransfer()

  const [completeOpen, setCompleteOpen] = useState(false)
  const status = STATUS[transaction.status]
  const isProcessed = transaction.status === 'PROCESSED'
  const isIncome = transaction.type === 'INCOME'
  const isTransfer = !!transaction.internalTransfer
  const canEditCategory = isProcessed && !isIncome && !isTransfer
  const c = categoryColor(transaction.category || transaction.merchant || '')
  const manualDetails = needsManualDetails(transaction)
  const displayName = isUnknownMerchant(transaction.merchant)
    ? isIncome
      ? 'Ingreso'
      : 'Comercio desconocido'
    : transaction.merchant

  return (
    <li className={`card card-hover flex flex-wrap items-center gap-x-3 gap-y-2 px-3.5 py-3 sm:flex-nowrap lg:h-14 lg:py-0 ${isTransfer ? 'opacity-60' : ''}`}>
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
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
        <p className="truncate text-sm font-medium">{displayName}</p>
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
          {manualDetails && (
            <>
              <span>·</span>
              <button
                type="button"
                onClick={() => setCompleteOpen(true)}
                className="inline-flex items-center gap-1 font-semibold text-neon-purple transition hover:brightness-125"
              >
                <PencilLine size={12} strokeWidth={2.4} />
                {transaction.status === 'FAILED' ? 'Completar a mano' : 'Agregar comercio'}
              </button>
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

      {/* Acciones: en pantallas chicas bajan a una segunda línea (antes se apretaban contra el
          monto y el nombre se truncaba a casi nada); desde sm vuelven a la misma línea. */}
      <div className="order-last flex basis-full items-center justify-end gap-1.5 border-t border-white/[0.06] pt-2 sm:order-none sm:basis-auto sm:border-0 sm:pt-0 empty:hidden">
        {canEditCategory && (
          <CategorySelect
            value={transaction.categoryCode}
            options={categoryOptions}
            disabled={isRecategorizing}
            onChange={(categoryCode) =>
              recategorize({ transactionId: transaction.transactionId, categoryCode })
            }
          />
        )}

        {isProcessed && !isTransfer && (
          <MoveTransactionMenu
            transaction={transaction}
            workspaces={workspaces}
            currentWorkspaceId={transaction.workspaceId}
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
      </div>

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
          ? `${isIncome && !isTransfer ? '+' : ''}${formatAmount(transaction.amount, transaction.currency)}`
          : '—'}
      </p>
      {completeOpen && (
        <CompleteExpenseModal open onClose={() => setCompleteOpen(false)} transaction={transaction} />
      )}
    </li>
  )
}

export default TransactionRow
