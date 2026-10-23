import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CircleHelp } from 'lucide-react'
import { getFieldHelp } from '../lib/fieldHelp'

const WIDTH = 288 // w-72
const MARGIN = 8
const ESTIMATED_HEIGHT = 240

/** Posición fija junto al botón: abajo si cabe, arriba si no; sin salirse del ancho de pantalla. */
function computePosition(button) {
  const rect = button.getBoundingClientRect()
  const width = Math.min(WIDTH, window.innerWidth - MARGIN * 2)
  const left = Math.min(Math.max(MARGIN, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - MARGIN)
  const below = window.innerHeight - rect.bottom
  if (below >= ESTIMATED_HEIGHT || below >= rect.top) {
    return { left, width, top: rect.bottom + 6, maxHeight: Math.max(120, below - 14) }
  }
  return { left, width, bottom: window.innerHeight - rect.top + 6, maxHeight: Math.max(120, rect.top - 14) }
}

/**
 * Botón de ayuda electrónica de un campo (ⓘ). Al pulsarlo despliega el CONCEPTO del campo y
 * cómo completarlo (ver `lib/fieldHelp.js`). Se abre con clic, toque o teclado (Enter/Espacio),
 * y se cierra con Escape, al pulsar fuera o al hacer scroll.
 *
 * El panel va en un portal sobre <body>: las tarjetas de la app tienen backdrop-filter, que
 * recorta a los hijos `fixed`, y los modales tienen overflow propio.
 */
export function FieldHelp({ helpKey, label }) {
  const entry = getFieldHelp(helpKey)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(null)
  const buttonRef = useRef(null)
  const panelId = useId()

  const close = useCallback(() => setOpen(false), [])

  useLayoutEffect(() => {
    if (open && buttonRef.current) setPosition(computePosition(buttonRef.current))
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
        buttonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open, close])

  if (!entry) return null

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Ayuda sobre ${label ?? entry.title}`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full transition ${
          open ? 'text-neon-purple' : 'text-off-white/40 hover:text-off-white/80'
        }`}
      >
        <CircleHelp size={14} strokeWidth={2.3} />
      </button>

      {open &&
        position &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[80]" onClick={close} />
            <div
              id={panelId}
              role="dialog"
              aria-label={`Ayuda: ${entry.title}`}
              style={position}
              className="fixed z-[90] overflow-y-auto rounded-xl border border-white/10 bg-midnight-800 p-3.5 text-left shadow-card"
            >
              <p className="text-sm font-semibold text-off-white">{entry.title}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-off-white/40">Qué es</p>
              <p className="mt-0.5 text-sm leading-snug text-off-white/75">{entry.concept}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-off-white/40">Cómo completarlo</p>
              <p className="mt-0.5 text-sm leading-snug text-off-white/75">{entry.usage}</p>
              {entry.example && (
                <p className="mt-2 rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-xs text-off-white/70">
                  Ejemplo: <span className="font-medium text-electric-mint">{entry.example}</span>
                </p>
              )}
            </div>
          </>,
          document.body,
        )}
    </>
  )
}

export default FieldHelp
