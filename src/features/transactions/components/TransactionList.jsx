import { useState } from 'react'
import { ChevronLeft, ChevronRight, ReceiptText } from 'lucide-react'
import { useTransactions } from '../api/useTransactions'
import { TransactionRow } from './TransactionRow'
import { useWorkspaces } from '../../workspaces/api/useWorkspaces'
import { useActiveWorkspace } from '../../workspaces/api/useActiveWorkspace'
import { useFitCount } from '../../../lib/useFitCount'

// Fuera de escritorio la página trae 10 filas y se scrollea de forma natural.
const MOBILE_PAGE_SIZE = 10
// En escritorio cada fila mide 56px (lg:h-14 en TransactionRow) más 8px de separación: el
// tamaño de página es lo que entra en el alto disponible, así nunca hay que scrollear.
const DESKTOP_ROW_PITCH = 64

function TransactionListSkeleton({ rows }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-2xl bg-white/[0.05]" />
      ))}
    </div>
  )
}

export function TransactionList() {
  // La página se guarda junto con el tamaño con el que se eligió: si el tamaño cambia (la
  // ventana se redimensiona) deja de significar lo mismo y se vuelve a la primera, sin efectos.
  const [pageState, setPageState] = useState({ page: 0, size: null })
  const { data: workspaces = [] } = useWorkspaces()
  const { workspace, workspaceIdParam } = useActiveWorkspace()
  const { ref, isDesktop, count: pageSize } = useFitCount({
    itemHeight: DESKTOP_ROW_PITCH,
    fallback: MOBILE_PAGE_SIZE,
    min: 3,
    max: 30,
  })

  const page = pageState.size === pageSize ? pageState.page : 0
  const setPage = (update) =>
    setPageState({ page: typeof update === 'function' ? update(page) : update, size: pageSize })

  const { data, isLoading, isError, error, isPlaceholderData } = useTransactions({
    page,
    size: pageSize ?? MOBILE_PAGE_SIZE,
    workspaceId: workspaceIdParam,
    // En escritorio se espera a medir: pedir con un tamaño provisional y luego otro serían dos consultas.
    enabled: pageSize != null,
  })

  // Para un módulo custom, el selector de categoría de cada fila usa las categorías de ese
  // módulo; para el General, cae al catálogo global.
  const categoryOptions =
    workspace && !workspace.isDefault
      ? (workspace.categories ?? [])
          .filter((c) => !c.archived)
          .map((c) => ({ code: c.code, displayName: c.displayName }))
      : undefined

  const totalPages = data ? Math.max(1, Math.ceil(data.totalElements / (pageSize ?? MOBILE_PAGE_SIZE))) : 1

  // El paginador de escritorio se reserva siempre (aunque haya una sola página): si apareciera
  // y desapareciera, cambiaría el alto de la lista y con él el tamaño de página.
  const showPager = isDesktop || totalPages > 1

  let body
  if (pageSize == null || isLoading) {
    body = <TransactionListSkeleton rows={isDesktop ? 6 : 4} />
  } else if (isError) {
    body = (
      <div className="card border-orange-400/25 bg-orange-400/10 p-6">
        <p className="font-semibold text-orange-300">No pudimos cargar tus transacciones</p>
        <p className="mt-1 text-sm text-off-white/60">{error?.message || 'Inténtalo de nuevo en unos minutos.'}</p>
      </div>
    )
  } else if (!data || data.items.length === 0) {
    body = (
      <div className="card flex flex-col items-center gap-3 p-10 text-center">
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
  } else {
    body = (
      <ul className={`space-y-2 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
        {data.items.map((transaction) => (
          <TransactionRow
            key={transaction.transactionId}
            transaction={transaction}
            workspaces={workspaces}
            categoryOptions={categoryOptions}
          />
        ))}
      </ul>
    )
  }

  return (
    <div className="mt-5 lg:mt-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      {showPager && (
        // Paginador arriba (fuera de la zona medida): se cambia de página sin scrollear.
        <div className="mb-2 flex shrink-0 items-center justify-between rounded-xl border border-white/10 bg-midnight/85 px-2 py-1.5 text-sm text-off-white/55 backdrop-blur max-lg:sticky max-lg:top-16 max-lg:z-20">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition hover:text-off-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <span className="tabular-nums">
            Página {page + 1} de {totalPages}
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

      {/* Zona medida: en escritorio recibe el alto que sobra y recorta lo que no entre. */}
      <div ref={ref} className="lg:min-h-0 lg:flex-1 lg:overflow-hidden">
        {body}
      </div>
    </div>
  )
}

export default TransactionList
