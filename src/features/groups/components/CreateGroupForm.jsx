import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCreateGroup } from '../api/useCreateGroup'
import { Button } from '../../../components/Button'

export function CreateGroupForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const { mutate, isPending, isError, reset } = useCreateGroup()

  function close() {
    setIsOpen(false)
    setName('')
    reset()
  }

  function handleSubmit(e) {
    e.preventDefault()
    mutate(name.trim(), { onSuccess: (group) => navigate(`/groups/${group.groupId}`) })
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neon-purple/40 bg-neon-purple/5 py-3.5 text-sm font-semibold text-neon-purple transition hover:bg-neon-purple/10"
      >
        <Plus size={16} strokeWidth={2.5} />
        Crear grupo
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-4">
      <p className="text-sm font-semibold">¿Cómo se llama el grupo?</p>

      <input
        type="text"
        required
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ej. Viaje a Cusco, Depa con Juan"
        className="input"
      />

      {isError && <p className="text-sm text-rose-300">No se pudo crear el grupo. Intenta de nuevo.</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="subtle" size="sm" onClick={close} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="mint" size="sm" loading={isPending}>
          {isPending ? 'Creando…' : 'Crear grupo'}
        </Button>
      </div>
    </form>
  )
}

export default CreateGroupForm
