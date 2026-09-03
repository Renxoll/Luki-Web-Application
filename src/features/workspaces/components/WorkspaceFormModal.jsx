import { useState } from 'react'
import { Check } from 'lucide-react'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { useWorkspaceMutations } from '../api/useWorkspaceMutations'
import {
  WORKSPACE_COLOR_OPTIONS,
  WORKSPACE_ICON_OPTIONS,
  DEFAULT_WORKSPACE_COLOR,
  DEFAULT_WORKSPACE_ICON,
  resolveIcon,
} from '../lib/workspaceTheme'

/**
 * Alta y edición de un módulo (nombre + color + ícono). `workspace` presente => modo
 * edición; ausente => alta, y al crear se selecciona el módulo nuevo vía `onCreated`.
 */
export function WorkspaceFormModal({ open, onClose, workspace, onCreated }) {
  const editing = Boolean(workspace)
  const { create, update } = useWorkspaceMutations()
  const mutation = editing ? update : create

  const [name, setName] = useState(workspace?.name ?? '')
  const [colorHex, setColorHex] = useState(workspace?.colorHex ?? DEFAULT_WORKSPACE_COLOR)
  const [icon, setIcon] = useState(workspace?.icon ?? DEFAULT_WORKSPACE_ICON)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    if (editing) {
      update.mutate({ id: workspace.id, name: trimmed, colorHex, icon }, { onSuccess: () => onClose() })
    } else {
      create.mutate(
        { name: trimmed, colorHex, icon },
        {
          onSuccess: (created) => {
            onCreated?.(created)
            onClose()
          },
        }
      )
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Editar módulo' : 'Crear módulo'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="workspace-name">
            Nombre
          </label>
          <input
            id="workspace-name"
            className="input"
            autoFocus
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ej. Empresa, Hijo, Inversiones"
          />
        </div>

        <div>
          <span className="label">Color</span>
          <div className="flex flex-wrap gap-2">
            {WORKSPACE_COLOR_OPTIONS.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => setColorHex(hex)}
                aria-label={`Color ${hex}`}
                aria-pressed={colorHex === hex}
                className={`grid h-8 w-8 place-items-center rounded-full ring-2 transition ${
                  colorHex === hex ? 'ring-white/80' : 'ring-transparent hover:ring-white/30'
                }`}
                style={{ backgroundColor: hex }}
              >
                {colorHex === hex && <Check size={15} strokeWidth={3} className="text-white" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="label">Ícono</span>
          <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10">
            {WORKSPACE_ICON_OPTIONS.map((name_) => {
              const IconCmp = resolveIcon(name_)
              const active = icon === name_
              return (
                <button
                  key={name_}
                  type="button"
                  onClick={() => setIcon(name_)}
                  aria-label={`Ícono ${name_}`}
                  aria-pressed={active}
                  className={`grid aspect-square place-items-center rounded-lg border transition ${
                    active
                      ? 'border-transparent text-white'
                      : 'border-white/10 text-off-white/60 hover:bg-white/[0.06] hover:text-off-white'
                  }`}
                  style={active ? { backgroundColor: colorHex } : undefined}
                >
                  <IconCmp size={16} strokeWidth={2.2} />
                </button>
              )
            })}
          </div>
        </div>

        {mutation.isError && (
          <p className="text-sm text-rose-300">No se pudo guardar el módulo. Intenta de nuevo.</p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="subtle" size="sm" onClick={onClose} disabled={mutation.isPending}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={mutation.isPending}>
            {editing ? 'Guardar' : 'Crear módulo'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default WorkspaceFormModal
