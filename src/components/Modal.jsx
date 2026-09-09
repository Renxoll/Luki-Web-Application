import { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Modal simple: overlay fijo, cierra con Esc o clic afuera. Sin portal -- se monta donde
 * se use, con z alto sobre el AppShell.
 *
 * Por defecto en móvil entra como hoja inferior (bottom sheet) y en escritorio va centrado.
 * Con `center` queda centrado en la pantalla en cualquier tamaño.
 */
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-md', center = false }) {
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const overlayClass = center
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
    : 'fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4'

  const panelClass = center
    ? `w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-midnight-800 p-5 shadow-card`
    : `w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-t-2xl border border-white/10 bg-midnight-800 p-5 shadow-card sm:rounded-2xl`

  return (
    <div
      className={overlayClass}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div className={panelClass} role="dialog" aria-modal="true" aria-label={title}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-off-white/50 transition hover:bg-white/5 hover:text-off-white"
            aria-label="Cerrar"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
