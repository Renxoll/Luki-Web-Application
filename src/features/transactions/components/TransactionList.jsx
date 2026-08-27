import { useState } from 'react'
import { useTransactions } from '../api/useTransactions'
import { TransactionRow } from './TransactionRow'

const PAGE_SIZE = 20

function TransactionListSkeleton() {
  return (
    <div className="mt-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center justify-between rounded-xl bg-white/5 p-4">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-4 w-16 rounded bg-white/10" />
        </div>
      ))}
    </div>
  )
}

export function TransactionList() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError, error } = useTransactions({ page, size: PAGE_SIZE })

  if (isLoading) return <TransactionListSkeleton />

  if (isError) {
    return (
      <div className="mt-4 rounded-2xl border border-orange-400/30 bg-orange-400/10 p-6">
        <p className="font-medium text-orange-300">No pudimos cargar tus transacciones</p>
        <p className="mt-1 text-sm text-off-white/60">{error?.message || 'Inténtalo de nuevo en unos minutos.'}</p>
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="mt-4 rounded-2xl bg-white/5 p-6 text-center text-sm text-off-white/60">
        Todavía no tienes transacciones registradas.
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(data.totalElements / PAGE_SIZE))

  return (
    <div className="mt-4">
      <ul className="space-y-2">
        {data.items.map((transaction) => (
          <TransactionRow key={transaction.transactionId} transaction={transaction} />
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-off-white/60">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-lg px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}

export default TransactionList
