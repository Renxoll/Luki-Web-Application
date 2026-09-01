import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAuthStore } from '../../../store/useAuthStore'
import { useAddExpense } from '../api/useAddExpense'
import { Button } from '../../../components/Button'

const CURRENCY = 'PEN'

export function AddExpenseForm({ groupId, members }) {
  const currentUserId = useAuthStore((state) => state.user?.id)
  const acceptedMembers = members.filter((m) => m.status === 'ACCEPTED')

  const [isOpen, setIsOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidByUserId, setPaidByUserId] = useState(currentUserId)
  const [participantUserIds, setParticipantUserIds] = useState(() => acceptedMembers.map((m) => m.userId))
  const { mutate, isPending, isError, reset } = useAddExpense(groupId)

  function close() {
    setIsOpen(false)
    setDescription('')
    setAmount('')
    setPaidByUserId(currentUserId)
    setParticipantUserIds(acceptedMembers.map((m) => m.userId))
    reset()
  }

  function toggleParticipant(userId) {
    setParticipantUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  function handleSubmit(e) {
    e.preventDefault()
    mutate(
      { description: description.trim(), amount: Number(amount), currency: CURRENCY, paidByUserId, participantUserIds },
      { onSuccess: close },
    )
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-electric-mint/40 bg-electric-mint/5 py-3.5 text-sm font-semibold text-electric-mint transition hover:bg-electric-mint/10"
      >
        <Plus size={16} strokeWidth={2.5} />
        Agregar gasto
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-4">
      <p className="text-sm font-semibold">¿En qué se gastó?</p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          required
          autoFocus
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="ej. Hotel, Cena, Taxi"
          className="input flex-1"
        />
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto (S/)"
          className="input sm:w-36"
        />
      </div>

      <div>
        <label className="label">¿Quién pagó?</label>
        <select value={paidByUserId} onChange={(e) => setPaidByUserId(e.target.value)} className="input">
          {acceptedMembers.map((member) => (
            <option key={member.userId} value={member.userId} className="bg-midnight">
              {member.userId === currentUserId ? 'Tú' : member.displayName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">¿Entre quiénes se divide?</label>
        <div className="space-y-1.5">
          {acceptedMembers.map((member) => (
            <label key={member.userId} className="flex items-center gap-2 text-sm text-off-white/80">
              <input
                type="checkbox"
                checked={participantUserIds.includes(member.userId)}
                onChange={() => toggleParticipant(member.userId)}
                className="h-4 w-4 rounded border-white/20 bg-white/10 accent-electric-mint"
              />
              {member.userId === currentUserId ? 'Tú' : member.displayName}
            </label>
          ))}
        </div>
      </div>

      {isError && <p className="text-sm text-rose-300">No se pudo registrar el gasto. Intenta de nuevo.</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="subtle" size="sm" onClick={close} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="mint" size="sm" loading={isPending} disabled={participantUserIds.length === 0}>
          {isPending ? 'Guardando…' : 'Guardar gasto'}
        </Button>
      </div>
    </form>
  )
}

export default AddExpenseForm
