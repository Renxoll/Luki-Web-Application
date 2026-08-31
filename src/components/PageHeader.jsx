import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/** Encabezado de sección: título + subtítulo opcional + acciones a la derecha. */
export function PageHeader({ title, subtitle, back, actions }) {
  const navigate = useNavigate()

  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {back && (
          <button
            type="button"
            onClick={() => navigate(back === true ? -1 : back)}
            className="mt-0.5 rounded-lg p-1.5 text-off-white/50 transition hover:bg-white/5 hover:text-off-white"
            aria-label="Volver"
          >
            <ArrowLeft size={20} strokeWidth={2.2} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-off-white/55">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}

export default PageHeader
