import { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Modal simple: overlay fijo, cierra con Esc o clic afuera. Sin portal -- se monta donde
 * se use, con z alto sobre el AppShell.
 */
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div
        className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-t-2xl border border-white/10 bg-midnight-800 p-5 shadow-card sm:rounded-2xl`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
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
