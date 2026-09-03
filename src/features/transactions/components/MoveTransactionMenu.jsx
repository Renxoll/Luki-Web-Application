import { useState } from 'react'
import { FolderInput, ChevronLeft } from 'lucide-react'
import { useMoveTransaction } from '../api/useMoveTransaction'
import { resolveIcon } from '../../workspaces/lib/workspaceTheme'

/**
 * Menú "mover a módulo" para una fila de transacción. Paso 1: elegir módulo destino.
 * Paso 2 (solo para gastos): elegir una categoría de ese módulo. Los ingresos se mueven
 * directo.
 */
export function MoveTransactionMenu({ transaction, workspaces, currentWorkspaceId }) {
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState(null)
  const { mutate, isPending } = useMoveTransaction()

  const isIncome = transaction.type === 'INCOME'
  const targets = workspaces.filter((w) => w.id !== currentWorkspaceId)

  function close() {
    setOpen(false)
    setTarget(null)
  }

  function move(workspaceId, categoryCode) {
    mutate({ transactionId: transaction.transactionId, workspaceId, categoryCode }, { onSuccess: close })
  }

  function pickTarget(w) {
    if (isIncome) {
      move(w.id, undefined)
    } else {
      setTarget(w)
    }
  }

  if (targets.length === 0) return null

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Mover a otro módulo"
        aria-label="Mover a otro módulo"
        className="grid h-8 w-8 place-items-center rounded-lg text-off-white/40 transition hover:bg-white/[0.08] hover:text-off-white/80"
      >
        <FolderInput size={15} strokeWidth={2.3} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={close} />
          <div className="absolute right-0 top-9 z-50 w-56 rounded-xl border border-white/10 bg-midnight-800 p-1.5 shadow-card">
            {!target && (
              <>
                <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-off-white/40">
                  Mover a…
                </p>
                {targets.map((w) => {
                  const Icon = resolveIcon(w.icon)
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => pickTarget(w)}
                      disabled={isPending}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-off-white/80 transition hover:bg-white/[0.07] disabled:opacity-50"
                    >
                      <span
                        className="grid h-6 w-6 shrink-0 place-items-center rounded-md"
                        style={{ backgroundColor: `${w.colorHex}22`, color: w.colorHex }}
                      >
                        <Icon size={13} strokeWidth={2.4} />
                      </span>
                      <span className="truncate">{w.name}</span>
                    </button>
                  )
                })}
              </>
            )}

            {target && (
              <>
                <button
                  type="button"
                  onClick={() => setTarget(null)}
                  className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-off-white/40 transition hover:text-off-white/70"
                >
                  <ChevronLeft size={12} strokeWidth={2.6} />
                  {target.name} · categoría
                </button>
                <div className="max-h-56 overflow-y-auto">
                  {(target.categories ?? [])
                    .filter((c) => !c.archived)
                    .map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => move(target.id, c.code)}
                        disabled={isPending}
                        className="block w-full truncate rounded-lg px-2 py-1.5 text-left text-sm text-off-white/80 transition hover:bg-white/[0.07] disabled:opacity-50"
                      >
                        {c.displayName}
                      </button>
                    ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default MoveTransactionMenu
