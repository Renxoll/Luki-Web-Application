import { useState } from 'react'
import { Minus } from 'lucide-react'
import { useRecordManualExpense } from '../api/useRecordManualExpense'
import { useCategories } from '../api/useCategories'
import { Button } from '../../../components/Button'
import { useActiveWorkspace } from '../../workspaces/api/useActiveWorkspace'

const CURRENCY = 'PEN'

export function RecordExpenseForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [merchant, setMerchant] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const { mutate, isPending, isError, reset } = useRecordManualExpense()
  const { workspace, workspaceIdParam } = useActiveWorkspace()

  const isCustomModule = Boolean(workspace && !workspace.isDefault)
  const { data: catalog = [] } = useCategories()
  const options = isCustomModule
    ? (workspace?.categories ?? []).filter((c) => !c.archived)
    : catalog

  // Sin pick explícito cae a la primera categoría disponible -- así el <select> nunca
  // manda "" (el backend rechaza un categoryCode vacío), sin necesidad de un efecto.
  const categoryCode = pickedCategory || options[0]?.code || ''

  function close() {
    setIsOpen(false)
    setAmount('')
    setMerchant('')
    setPickedCategory('')
    reset()
  }

  function handleSubmit(e) {
    e.preventDefault()
    mutate(
      {
        amount: Number(amount),
        currency: CURRENCY,
        merchant: merchant.trim(),
        categoryCode,
        workspaceId: workspaceIdParam,
      },
      { onSuccess: close }
    )
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-orange-400/40 bg-orange-400/5 py-3.5 text-sm font-semibold text-orange-300 transition hover:bg-orange-400/10"
      >
        <Minus size={16} strokeWidth={2.5} />
        Registrar un gasto
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-4">
      <p className="text-sm font-semibold">
        ¿En qué gastaste?
        {workspace && !workspace.isDefault && (
          <span className="ml-1 font-normal text-off-white/50">· {workspace.name}</span>
        )}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          required
          autoFocus
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto (S/)"
          className="input sm:w-36"
        />
        <input
          type="text"
          required
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          placeholder="¿En qué o a quién? (ej. Almuerzo, Uber, Juan Pérez)"
          className="input flex-1"
        />
      </div>

      <select
        value={categoryCode}
        onChange={(e) => setPickedCategory(e.target.value)}
        required
        className="input"
      >
        {options.length === 0 && <option value="">Cargando categorías…</option>}
        {options.map((c) => (
          <option key={c.code} value={c.code} className="bg-midnight text-off-white">
            {c.displayName}
          </option>
        ))}
      </select>

      {isError && (
        <p className="text-sm text-rose-300">No se pudo registrar el gasto. Intenta de nuevo.</p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="subtle" size="sm" onClick={close} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="sm" loading={isPending} disabled={!categoryCode}>
          {isPending ? 'Guardando…' : 'Guardar gasto'}
        </Button>
      </div>
    </form>
  )
}

export default RecordExpenseForm
