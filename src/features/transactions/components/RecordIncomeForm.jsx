import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useRecordManualIncome } from '../api/useRecordManualIncome'
import { Button } from '../../../components/Button'
import { useActiveWorkspace } from '../../workspaces/api/useActiveWorkspace'

const CURRENCY = 'PEN'

export function RecordIncomeForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('')
  const { mutate, isPending, isError, reset } = useRecordManualIncome()
  const { workspace, workspaceIdParam } = useActiveWorkspace()

  function close() {
    setIsOpen(false)
    setAmount('')
    setSource('')
    reset()
  }

  function handleSubmit(e) {
    e.preventDefault()
    mutate(
      { amount: Number(amount), currency: CURRENCY, source: source.trim(), workspaceId: workspaceIdParam },
      { onSuccess: close }
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
        Registrar un ingreso
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-4">
      <p className="text-sm font-semibold">
        ¿Cuánto te depositaron?
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
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="¿De quién o de dónde? (ej. Sueldo, Juan Pérez)"
          className="input flex-1"
        />
      </div>

      {isError && (
        <p className="text-sm text-rose-300">No se pudo registrar el ingreso. Intenta de nuevo.</p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="subtle" size="sm" onClick={close} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="mint" size="sm" loading={isPending}>
          {isPending ? 'Guardando…' : 'Guardar ingreso'}
        </Button>
      </div>
    </form>
  )
}

export default RecordIncomeForm
