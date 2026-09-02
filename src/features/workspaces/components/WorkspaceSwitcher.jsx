import { useState } from 'react'
import { Plus, Settings2 } from 'lucide-react'
import { useWorkspaces } from '../api/useWorkspaces'
import { useActiveWorkspace } from '../api/useActiveWorkspace'
import { useWorkspaceStore } from '../../../store/useWorkspaceStore'
import { WorkspaceFormModal } from './WorkspaceFormModal'
import { WorkspaceSettingsModal } from './WorkspaceSettingsModal'
import { resolveIcon } from '../lib/workspaceTheme'

/**
 * Selector de módulo: una "pastilla" por módulo (ícono + nombre), la activa resaltada con
 * su color, un engranaje para sus ajustes y una pastilla "+ Módulo" para crear uno nuevo.
 * Se usa en Movimientos y en el Resumen -- comparte el módulo activo vía el store.
 */
export function WorkspaceSwitcher({ className = '' }) {
  const { data: workspaces = [], isLoading } = useWorkspaces()
  const { workspace: active } = useActiveWorkspace()
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace)

  const [createOpen, setCreateOpen] = useState(false)
  const [settingsFor, setSettingsFor] = useState(null)

  if (isLoading || workspaces.length === 0) {
    return <div className={`h-10 animate-pulse rounded-xl bg-white/[0.05] ${className}`} />
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {workspaces.map((w) => {
          const Icon = resolveIcon(w.icon)
          const isActive = active?.id === w.id
          return (
            <div key={w.id} className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => setActiveWorkspace(w.id)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 rounded-l-xl border py-2 pl-3 pr-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'border-transparent text-white'
                    : 'border-white/10 text-off-white/60 hover:bg-white/[0.05] hover:text-off-white/90'
                } ${isActive ? '' : 'rounded-r-xl'}`}
                style={isActive ? { backgroundColor: w.colorHex } : undefined}
              >
                <Icon size={15} strokeWidth={2.3} />
                {w.name}
              </button>
              {isActive && (
                <button
                  type="button"
                  onClick={() => setSettingsFor(w)}
                  aria-label={`Ajustes de ${w.name}`}
                  className="grid h-[38px] place-items-center rounded-r-xl px-2 text-white/80 transition hover:text-white"
                  style={{ backgroundColor: w.colorHex }}
                >
                  <Settings2 size={15} strokeWidth={2.3} />
                </button>
              )}
            </div>
          )
        })}

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-dashed border-neon-purple/40 bg-neon-purple/5 py-2 px-3 text-sm font-semibold text-neon-purple transition hover:bg-neon-purple/10"
        >
          <Plus size={15} strokeWidth={2.6} />
          Módulo
        </button>
      </div>

      {createOpen && (
        <WorkspaceFormModal
          open
          onClose={() => setCreateOpen(false)}
          onCreated={(created) => setActiveWorkspace(created.id)}
        />
      )}
      {settingsFor && (
        <WorkspaceSettingsModal
          open
          workspace={settingsFor}
          onClose={() => setSettingsFor(null)}
          onArchived={() => setActiveWorkspace(null)}
        />
      )}
    </div>
  )
}

export default WorkspaceSwitcher
