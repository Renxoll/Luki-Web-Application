import { useState } from 'react'
import { useRecordManualIncome } from '../api/useRecordManualIncome'

const CURRENCY = 'PEN'

export function RecordIncomeForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('')
  const { mutate, isPending, isError, reset } = useRecordManualIncome()

  function close() {
    setIsOpen(false)
    setAmount('')
    setSource('')
    reset()
  }

  function handleSubmit(e) {
    e.preventDefault()
    mutate(
      { amount: Number(amount), currency: CURRENCY, source: source.trim() },
      { onSuccess: close },
    )
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-4 w-full rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 py-3 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/10"
      >
        + Registrar un ingreso
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-xl bg-white/5 p-4">
      <p className="text-sm font-medium text-off-white">¿Cuánto te depositaron?</p>

      <div className="flex gap-2">
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
          className="w-32 rounded-lg bg-white/10 px-3 py-2 text-sm text-off-white placeholder:text-off-white/40 outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="text"
          required
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="¿De quién o de dónde? (ej. Sueldo, Juan Pérez)"
          className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-off-white placeholder:text-off-white/40 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {isError && <p className="text-sm text-red-400/90">No se pudo registrar el ingreso. Intenta de nuevo.</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={close}
          disabled={isPending}
          className="rounded-lg px-3 py-2 text-sm text-off-white/60 transition hover:text-off-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Guardando...' : 'Guardar ingreso'}
        </button>
      </div>
    </form>
  )
}

export default RecordIncomeForm
