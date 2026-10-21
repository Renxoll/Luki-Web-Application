import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FolderInput, ChevronLeft } from 'lucide-react'
import { useMoveTransaction } from '../api/useMoveTransaction'
import { resolveIcon } from '../../workspaces/lib/workspaceTheme'

const MENU_WIDTH = 224 // w-56
const MENU_MAX_HEIGHT = 288
const VIEWPORT_MARGIN = 8

/**
 * Posición fija del menú respecto del botón. Se abre hacia abajo y, si no hay espacio (fila
 * al pie de la pantalla), hacia arriba; nunca se sale horizontalmente del viewport.
 */
function computePosition(button) {
  const rect = button.getBoundingClientRect()
  const left = Math.min(Math.max(VIEWPORT_MARGIN, rect.right - MENU_WIDTH), window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN)
  const spaceBelow = window.innerHeight - rect.bottom
  if (spaceBelow >= MENU_MAX_HEIGHT || spaceBelow >= rect.top) {
    return { left, top: rect.bottom + 6, maxHeight: Math.min(MENU_MAX_HEIGHT, spaceBelow - 12) }
  }
  return { left, bottom: window.innerHeight - rect.top + 6, maxHeight: Math.min(MENU_MAX_HEIGHT, rect.top - 12) }
}

/**
 * Menú "mover a módulo" para una fila de transacción. Paso 1: elegir módulo destino.
 * Paso 2 (solo para gastos): elegir una categoría de ese módulo. Los ingresos se mueven
 * directo.
 */
export function MoveTransactionMenu({ transaction, workspaces, currentWorkspaceId }) {
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState(null)
  const [position, setPosition] = useState(null)
  const buttonRef = useRef(null)
  const { mutate, isPending } = useMoveTransaction()

  const isIncome = transaction.type === 'INCOME'
  const targets = workspaces.filter((w) => w.id !== currentWorkspaceId)

  const close = useCallback(() => {
    setOpen(false)
    setTarget(null)
  }, [])

  // El menú se pinta en un portal sobre <body>: cada tarjeta tiene backdrop-filter, que crea
  // su propio contexto de apilamiento, y un menú "absolute" dentro de ella quedaba tapado por
  // la tarjeta siguiente sin importar su z-index.
  useLayoutEffect(() => {
    if (open && buttonRef.current) setPosition(computePosition(buttonRef.current))
  }, [open, target])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    // Con la lista scrolleando o la ventana cambiando de tamaño, el botón se mueve: cerrar es
    // más simple y predecible que reposicionar.
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open, close])

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
    <div className="shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title="Mover a otro módulo"
        aria-label="Mover a otro módulo"
        className={`grid h-8 w-8 place-items-center rounded-lg transition ${
          open ? 'bg-white/[0.1] text-off-white' : 'text-off-white/40 hover:bg-white/[0.08] hover:text-off-white/80'
        }`}
      >
        <FolderInput size={15} strokeWidth={2.3} />
      </button>

      {open &&
        position &&
        createPortal(
        <>
          <div className="fixed inset-0 z-[60]" onClick={close} />
          <div
            role="menu"
            style={{ ...position, width: MENU_WIDTH }}
            className="fixed z-[70] overflow-y-auto rounded-xl border border-white/10 bg-midnight-800 p-1.5 shadow-card"
          >
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
                <div>
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
        </>,
        document.body
      )}
    </div>
  )
}

export default MoveTransactionMenu
