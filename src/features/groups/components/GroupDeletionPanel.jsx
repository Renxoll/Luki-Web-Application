import { useState } from 'react'
import { Trash2, TriangleAlert } from 'lucide-react'
import { useAuthStore } from '../../../store/useAuthStore'
import { useGroupDeletion } from '../api/useGroupDeletion'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'

/**
 * "Zona de riesgo" al pie del detalle del grupo: proponer el borrado del grupo y juntar las
 * aprobaciones del resto. Cuando aprueban todos los miembros aceptados, el backend borra el
 * grupo y sus datos (y el hook navega de vuelta a /groups).
 *
 * @param {{ groupId: string, deletionRequest: object | null, members: Array<object> }} props
 */
export function GroupDeletionPanel({ groupId, deletionRequest, members }) {
  const currentUserId = useAuthStore((state) => state.user?.id)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { request, approve, cancel } = useGroupDeletion(groupId)

  const acceptedCount = members.filter((m) => m.status === 'ACCEPTED').length
  const outstandingError = approve.error?.response?.status === 409

  if (!deletionRequest) {
    return (
      <div className="card border-rose-500/20 bg-rose-500/[0.04] p-4">
        <p className="text-sm font-semibold text-rose-200">Borrar grupo</p>
        <p className="mt-1 text-xs text-off-white/50">
          Necesita el visto bueno de todos los miembros. Solo se puede borrar si no quedan saldos pendientes.
        </p>
        <Button variant="danger" size="sm" icon={Trash2} className="mt-3" onClick={() => setConfirmOpen(true)}>
          Solicitar borrado del grupo
        </Button>
        {request.isError && (
          <p className="mt-2 text-sm text-rose-300">No se pudo abrir la solicitud. Intenta de nuevo.</p>
        )}

        <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="¿Solicitar borrado del grupo?">
          <p className="text-sm text-off-white/70">
            Se le pedirá a cada miembro que confirme. Cuando estén todos de acuerdo, el grupo y todos sus gastos se
            borran para siempre.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="subtle" size="sm" onClick={() => setConfirmOpen(false)} disabled={request.isPending}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={request.isPending}
              onClick={() => request.mutate(undefined, { onSuccess: () => setConfirmOpen(false) })}
            >
              Sí, solicitar borrado
            </Button>
          </div>
        </Modal>
      </div>
    )
  }

  const approvedCount = deletionRequest.approvedByUserIds.length
  const alreadyApproved = deletionRequest.approvedByUserIds.includes(currentUserId)
  const pendingNames = members
    .filter((m) => deletionRequest.pendingApprovalFrom.includes(m.userId))
    .map((m) => (m.userId === currentUserId ? 'Tú' : m.displayName))

  return (
    <div className="card border-rose-500/30 bg-rose-500/[0.07] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-500/15 text-rose-300">
          <TriangleAlert size={16} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-rose-100">
            {deletionRequest.requestedBy === currentUserId ? 'Tú' : deletionRequest.requestedByDisplayName} quiere borrar
            este grupo
          </p>
          <p className="mt-0.5 text-xs text-off-white/55">
            Aprobaron {approvedCount} de {acceptedCount}.
            {pendingNames.length > 0 && ` Falta: ${pendingNames.join(', ')}.`}
          </p>
        </div>
      </div>

      {outstandingError && (
        <p className="mt-3 text-sm text-rose-300">
          Salden todas las deudas del grupo antes de borrarlo (marca los pagos pendientes como pagados).
        </p>
      )}

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <Button variant="subtle" size="sm" loading={cancel.isPending} onClick={() => cancel.mutate()}>
          Cancelar solicitud
        </Button>
        {!alreadyApproved && (
          <Button variant="danger" size="sm" icon={Trash2} loading={approve.isPending} onClick={() => approve.mutate()}>
            Aprobar borrado
          </Button>
        )}
      </div>
    </div>
  )
}

export default GroupDeletionPanel
