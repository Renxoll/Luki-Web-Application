import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAuthStore } from '../../../store/useAuthStore'
import { useAddExpense } from '../api/useAddExpense'
import { Button } from '../../../components/Button'
import { ExpenseFormFields } from './ExpenseFormFields'

const CURRENCY = 'PEN'

export function AddExpenseForm({ groupId, members }) {
  const currentUserId = useAuthStore((state) => state.user?.id)
  const acceptedMembers = members.filter((m) => m.status === 'ACCEPTED')

  const [isOpen, setIsOpen] = useState(false)
  const [values, setValues] = useState(() => initialValues(currentUserId, acceptedMembers))
  const { mutate, isPending, isError, reset } = useAddExpense(groupId)

  function patch(next) {
    setValues((prev) => ({ ...prev, ...next }))
  }

  function close() {
    setIsOpen(false)
    setValues(initialValues(currentUserId, acceptedMembers))
    reset()
  }

  function handleSubmit(e) {
    e.preventDefault()
    mutate(
      {
        description: values.description.trim(),
        amount: Number(values.amount),
        currency: CURRENCY,
        paidByUserId: values.paidByUserId,
        participantUserIds: values.participantUserIds,
      },
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

      <ExpenseFormFields
        values={values}
        onChange={patch}
        acceptedMembers={acceptedMembers}
        currentUserId={currentUserId}
      />

      {isError && <p className="text-sm text-rose-300">No se pudo registrar el gasto. Intenta de nuevo.</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="subtle" size="sm" onClick={close} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="mint"
          size="sm"
          loading={isPending}
          disabled={values.participantUserIds.length === 0}
        >
          {isPending ? 'Guardando…' : 'Guardar gasto'}
        </Button>
      </div>
    </form>
  )
}

function initialValues(currentUserId, acceptedMembers) {
  return {
    description: '',
    amount: '',
    paidByUserId: currentUserId,
    participantUserIds: acceptedMembers.map((m) => m.userId),
  }
}

export default AddExpenseForm
