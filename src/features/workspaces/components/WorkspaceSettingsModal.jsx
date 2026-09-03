import { useState } from 'react'
import { Pencil, Archive } from 'lucide-react'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { WorkspaceCategoryEditor } from './WorkspaceCategoryEditor'
import { WorkspaceFormModal } from './WorkspaceFormModal'
import { useWorkspaceMutations } from '../api/useWorkspaceMutations'
import { WorkspaceGlyph } from '../lib/WorkspaceGlyph'

/** Ajustes de un módulo: editar nombre/color/ícono, sus categorías, y archivarlo. */
export function WorkspaceSettingsModal({ open, onClose, workspace, onArchived }) {
  const { archive } = useWorkspaceMutations()
  const [editOpen, setEditOpen] = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)

  if (!workspace) return null

  function handleArchive() {
    archive.mutate(workspace.id, {
      onSuccess: () => {
        onArchived?.()
        onClose()
      },
    })
  }

  return (
    <>
      <Modal open={open && !editOpen} onClose={onClose} title="Ajustes del módulo">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: `${workspace.colorHex}22`, color: workspace.colorHex }}
            >
              <WorkspaceGlyph name={workspace.icon} size={20} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{workspace.name}</p>
              <p className="text-xs text-off-white/50">
                {workspace.isDefault ? 'Módulo por defecto' : 'Módulo personalizado'}
              </p>
            </div>
            <Button variant="ghost" size="sm" icon={Pencil} onClick={() => setEditOpen(true)}>
              Editar
            </Button>
          </div>

          <div>
            <p className="section-title mb-2">Categorías</p>
            <WorkspaceCategoryEditor workspace={workspace} />
          </div>

          {!workspace.isDefault && (
            <div className="border-t border-white/[0.07] pt-4">
              {confirmArchive ? (
                <div className="space-y-3">
                  <p className="text-sm text-off-white/70">
                    Los movimientos de este módulo no se borran, pero el módulo deja de aparecer.
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button variant="subtle" size="sm" onClick={() => setConfirmArchive(false)} disabled={archive.isPending}>
                      Cancelar
                    </Button>
                    <Button variant="danger" size="sm" loading={archive.isPending} onClick={handleArchive}>
                      Archivar módulo
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmArchive(true)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-rose-300/80 transition hover:text-rose-300"
                >
                  <Archive size={15} strokeWidth={2.2} />
                  Archivar este módulo
                </button>
              )}
            </div>
          )}
        </div>
      </Modal>

      {editOpen && (
        <WorkspaceFormModal open onClose={() => setEditOpen(false)} workspace={workspace} />
      )}
    </>
  )
}

export default WorkspaceSettingsModal
