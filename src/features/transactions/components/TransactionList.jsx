import { useState } from 'react'
import { ChevronLeft, ChevronRight, ReceiptText } from 'lucide-react'
import { useTransactions } from '../api/useTransactions'
import { TransactionRow } from './TransactionRow'
import { useWorkspaces } from '../../workspaces/api/useWorkspaces'
import { useActiveWorkspace } from '../../workspaces/api/useActiveWorkspace'

const PAGE_SIZE = 20

function TransactionListSkeleton() {
  return (
    <div className="mt-5 space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[70px] animate-pulse rounded-2xl bg-white/[0.05]" />
      ))}
    </div>
  )
}

export function TransactionList() {
  const [page, setPage] = useState(0)
  const { data: workspaces = [] } = useWorkspaces()
  const { workspace, workspaceIdParam } = useActiveWorkspace()

  const { data, isLoading, isError, error } = useTransactions({
    page,
    size: PAGE_SIZE,
    workspaceId: workspaceIdParam,
  })

  // Para un módulo custom, el selector de categoría de cada fila usa las categorías de ese
  // módulo; para el General, cae al catálogo global.
  const categoryOptions =
    workspace && !workspace.isDefault
      ? (workspace.categories ?? [])
          .filter((c) => !c.archived)
          .map((c) => ({ code: c.code, displayName: c.displayName }))
      : undefined

  if (isLoading) return <TransactionListSkeleton />

  if (isError) {
    return (
      <div className="card mt-5 border-orange-400/25 bg-orange-400/10 p-6">
        <p className="font-semibold text-orange-300">No pudimos cargar tus transacciones</p>
        <p className="mt-1 text-sm text-off-white/60">{error?.message || 'Inténtalo de nuevo en unos minutos.'}</p>
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="card mt-5 flex flex-col items-center gap-3 p-10 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] text-off-white/40">
          <ReceiptText size={22} />
        </span>
        <p className="text-sm text-off-white/55">
          {workspace && !workspace.isDefault
            ? `Aún no hay movimientos en “${workspace.name}”. Mueve un gasto acá desde otro módulo.`
            : 'Todavía no hay movimientos. Conecta tu Gmail y aparecerán solos.'}
        </p>
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(data.totalElements / PAGE_SIZE))

  return (
    <div className="mt-5">
      <ul className="space-y-2">
        {data.items.map((transaction) => (
          <TransactionRow
            key={transaction.transactionId}
            transaction={transaction}
            workspaces={workspaces}
            categoryOptions={categoryOptions}
          />
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm text-off-white/55">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition hover:text-off-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <span className="tabular-nums">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition hover:text-off-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default TransactionList
