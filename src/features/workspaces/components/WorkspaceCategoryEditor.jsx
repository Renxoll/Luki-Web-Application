import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { useWorkspaceMutations } from '../api/useWorkspaceMutations'
import { WorkspaceGlyph } from '../lib/WorkspaceGlyph'

function CategoryRow({ workspaceId, category, colorHex, canDelete }) {
  const { updateCategory, archiveCategory } = useWorkspaceMutations()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.displayName)

  function save() {
    const trimmed = name.trim()
    if (!trimmed || trimmed === category.displayName) {
      setEditing(false)
      setName(category.displayName)
      return
    }
    updateCategory.mutate(
      { id: workspaceId, categoryId: category.id, displayName: trimmed, icon: category.icon },
      { onSuccess: () => setEditing(false) }
    )
  }

  return (
    <li className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2">
      <span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
        style={{ backgroundColor: `${colorHex}22`, color: colorHex }}
      >
        <WorkspaceGlyph name={category.icon} size={14} strokeWidth={2.3} />
      </span>

      {editing ? (
        <input
          className="input h-8 flex-1 py-1 text-sm"
          autoFocus
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') {
              setEditing(false)
              setName(category.displayName)
            }
          }}
        />
      ) : (
        <span className="flex-1 truncate text-sm">{category.displayName}</span>
      )}

      {editing ? (
        <>
          <button
            type="button"
            onClick={save}
            disabled={updateCategory.isPending}
            className="rounded-md p-1.5 text-emerald-300 hover:bg-white/[0.06]"
            aria-label="Guardar"
          >
            <Check size={15} strokeWidth={2.6} />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false)
              setName(category.displayName)
            }}
            className="rounded-md p-1.5 text-off-white/50 hover:bg-white/[0.06]"
            aria-label="Cancelar"
          >
            <X size={15} strokeWidth={2.6} />
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md p-1.5 text-off-white/40 hover:bg-white/[0.06] hover:text-off-white/80"
            aria-label={`Renombrar ${category.displayName}`}
          >
            <Pencil size={14} strokeWidth={2.3} />
          </button>
          <button
            type="button"
            onClick={() => archiveCategory.mutate({ id: workspaceId, categoryId: category.id })}
            disabled={!canDelete || archiveCategory.isPending}
            title={canDelete ? 'Archivar categoría' : 'Un módulo necesita al menos una categoría'}
            className="rounded-md p-1.5 text-off-white/40 hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={`Archivar ${category.displayName}`}
          >
            <Trash2 size={14} strokeWidth={2.3} />
          </button>
        </>
      )}
    </li>
  )
}

/** Lista editable de categorías de un módulo (activas). */
export function WorkspaceCategoryEditor({ workspace }) {
  const { addCategory } = useWorkspaceMutations()
  const [newName, setNewName] = useState('')
  const active = (workspace.categories ?? []).filter((c) => !c.archived)

  function add(e) {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) return
    addCategory.mutate({ id: workspace.id, displayName: trimmed }, { onSuccess: () => setNewName('') })
  }

  return (
    <div className="space-y-2">
      <ul className="space-y-1.5">
        {active.map((category) => (
          <CategoryRow
            key={category.id}
            workspaceId={workspace.id}
            category={category}
            colorHex={workspace.colorHex}
            canDelete={active.length > 1}
          />
        ))}
      </ul>

      <form onSubmit={add} className="flex gap-2">
        <input
          className="input h-9 flex-1 py-1 text-sm"
          value={newName}
          maxLength={60}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nueva categoría"
        />
        <button
          type="submit"
          disabled={!newName.trim() || addCategory.isPending}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-off-white/80 transition hover:bg-white/[0.14] disabled:opacity-40"
          aria-label="Agregar categoría"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  )
}

export default WorkspaceCategoryEditor
