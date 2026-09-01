import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { useInviteMember } from '../api/useInviteMember'
import { Button } from '../../../components/Button'

const ERROR_MESSAGES = {
  400: 'Ese email no tiene una cuenta en SmartCash todavía. Pídele que se registre primero.',
  409: 'Esa persona ya es miembro o ya tiene una invitación pendiente.',
}

export function InviteMemberForm({ groupId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const { mutate, isPending, isError, error, reset } = useInviteMember(groupId)

  function close() {
    setIsOpen(false)
    setEmail('')
    reset()
  }

  function handleSubmit(e) {
    e.preventDefault()
    mutate(email.trim(), { onSuccess: close })
  }

  const errorMessage = ERROR_MESSAGES[error?.response?.status] || 'No se pudo enviar la invitación. Intenta de nuevo.'

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-off-white/50 transition hover:text-off-white"
      >
        <UserPlus size={14} strokeWidth={2.3} />
        Invitar a alguien
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-2 space-y-3 p-4">
      <p className="text-sm font-semibold">Invitar por email</p>
      <p className="text-xs text-off-white/45">Solo puedes invitar a alguien que ya tenga cuenta en SmartCash.</p>

      <input
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="correo@ejemplo.com"
        className="input"
      />

      {isError && <p className="text-sm text-rose-300">{errorMessage}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="subtle" size="sm" onClick={close} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="mint" size="sm" loading={isPending}>
          {isPending ? 'Invitando…' : 'Invitar'}
        </Button>
      </div>
    </form>
  )
}

export default InviteMemberForm
