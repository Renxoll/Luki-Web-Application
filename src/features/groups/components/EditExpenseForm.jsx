import { useState } from 'react'
import { useAuthStore } from '../../../store/useAuthStore'
import { useEditExpense } from '../api/useEditExpense'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { ExpenseFormFields } from './ExpenseFormFields'

const ERROR_MESSAGES = {
  403: 'Solo quien pagó el gasto o quien creó el grupo puede corregirlo.',
  404: 'Este gasto ya no existe. Recarga la página.',
}

/**
 * Corrige un gasto ya registrado. Se abre en un Modal desde la lista de gastos, precargado
 * con los datos actuales del gasto.
 *
 * @param {{ groupId: string, expense: object, members: Array<object>, onClose: () => void }} props
 */
export function EditExpenseForm({ groupId, expense, members, onClose }) {
  const currentUserId = useAuthStore((state) => state.user?.id)
  const acceptedMembers = members.filter((m) => m.status === 'ACCEPTED')

  const [values, setValues] = useState(() => ({
    description: expense.description,
    amount: String(expense.amount),
    paidByUserId: expense.paidByUserId,
    participantUserIds: expense.shares.map((s) => s.userId),
  }))
  const { mutate, isPending, isError, error } = useEditExpense(groupId)

  function patch(next) {
    setValues((prev) => ({ ...prev, ...next }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    mutate(
      {
        expenseId: expense.expenseId,
        description: values.description.trim(),
        amount: Number(values.amount),
        currency: expense.currency,
        paidByUserId: values.paidByUserId,
        participantUserIds: values.participantUserIds,
      },
      { onSuccess: onClose },
    )
  }

  const errorMessage = ERROR_MESSAGES[error?.response?.status] || 'No se pudo guardar el cambio. Intenta de nuevo.'

  return (
    <Modal open onClose={onClose} title="Corregir gasto">
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-xs text-off-white/45">
          Al guardar, la división se recalcula en partes iguales entre los participantes marcados.
        </p>

        <ExpenseFormFields
          values={values}
          onChange={patch}
          acceptedMembers={acceptedMembers}
          currentUserId={currentUserId}
        />

        {isError && <p className="text-sm text-rose-300">{errorMessage}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="subtle" size="sm" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="mint"
            size="sm"
            loading={isPending}
            disabled={values.participantUserIds.length === 0}
          >
            {isPending ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EditExpenseForm
