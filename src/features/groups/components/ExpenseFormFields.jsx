import { useId } from 'react'
import { FieldLabel } from '../../../components/Field'

/**
 * Campos compartidos entre "Agregar gasto" y "Editar gasto": descripción + monto, quién
 * pagó, y entre quiénes se divide. El estado vive en el componente padre; acá solo se
 * renderiza y se notifican los cambios.
 *
 * @param {{
 *   values: { description: string, amount: string, paidByUserId: string, participantUserIds: string[] },
 *   onChange: (patch: object) => void,
 *   acceptedMembers: Array<{ userId: string, displayName: string }>,
 *   currentUserId: string,
 *   autoFocus?: boolean,
 * }} props
 */
export function ExpenseFormFields({ values, onChange, acceptedMembers, currentUserId, autoFocus = true }) {
  const { description, amount, paidByUserId, participantUserIds } = values
  // Alta y edición pueden estar montadas a la vez: cada instancia necesita sus propios ids.
  const uid = useId()

  function toggleParticipant(userId) {
    onChange({
      participantUserIds: participantUserIds.includes(userId)
        ? participantUserIds.filter((id) => id !== userId)
        : [...participantUserIds, userId],
    })
  }

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <FieldLabel id={`${uid}-description`} label="Descripción" help="groups.expense.description" />
          <input
            id={`${uid}-description`}
            type="text"
            required
            autoFocus={autoFocus}
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="ej. Hotel, Cena, Taxi"
            className="input"
          />
        </div>
        <div className="sm:w-36">
          <FieldLabel id={`${uid}-amount`} label="Monto (S/)" help="groups.expense.amount" />
          <input
            id={`${uid}-amount`}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => onChange({ amount: e.target.value })}
            placeholder="0.00"
            className="input"
          />
        </div>
      </div>

      <div>
        <FieldLabel id={`${uid}-paidBy`} label="¿Quién pagó?" help="groups.expense.paidBy" />
        <select id={`${uid}-paidBy`} value={paidByUserId} onChange={(e) => onChange({ paidByUserId: e.target.value })} className="input">
          {acceptedMembers.map((member) => (
            <option key={member.userId} value={member.userId} className="bg-midnight">
              {member.userId === currentUserId ? 'Tú' : member.displayName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel label="¿Entre quiénes se divide?" help="groups.expense.participants" />
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
    </>
  )
}

export default ExpenseFormFields
