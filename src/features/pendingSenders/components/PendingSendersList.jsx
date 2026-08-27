import { usePendingSenders } from '../api/usePendingSenders'
import { PendingSenderCard } from './PendingSenderCard'

export function PendingSendersList() {
  const { data: pendingSenders, isLoading, isError } = usePendingSenders()

  // Sin loading/error skeletons a propósito: es una sección secundaria del dashboard, no
  // el contenido principal -- si falla o todavía carga, simplemente no se muestra nada en
  // vez de competir visualmente con el resumen del mes.
  if (isLoading || isError || !pendingSenders || pendingSenders.length === 0) {
    return null
  }

  return (
    <div className="mt-3 space-y-3">
      {pendingSenders.map((pendingSender) => (
        <PendingSenderCard key={pendingSender.pendingSenderId} pendingSender={pendingSender} />
      ))}
    </div>
  )
}

export default PendingSendersList
