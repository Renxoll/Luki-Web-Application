import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { useCategories } from '../api/useCategories'
import { useCorrectTransactionDetails } from '../api/useCorrectTransactionDetails'
import { isUnknownMerchant } from '../lib/unknownMerchant'
import { FieldLabel } from '../../../components/Field'

/**
 * Pone a mano en qué se gastó: monto + comercio, y la categoría cuando Luki no pudo leer el
 * correo (FAILED). En un gasto ya leído solo se corrige monto y comercio; la categoría se
 * cambia desde el selector de la fila.
 */
export function CompleteExpenseModal({ open, onClose, transaction }) {
  const needsCategory = transaction.status === 'FAILED'
  const { data: catalog = [] } = useCategories()
  const { mutate, isPending, isError, error } = useCorrectTransactionDetails()

  const [amount, setAmount] = useState(transaction.amount > 0 ? String(transaction.amount) : '')
  const [merchant, setMerchant] = useState(isUnknownMerchant(transaction.merchant) ? '' : transaction.merchant)
  const [pickedCategory, setPickedCategory] = useState('')
  // Sin elección explícita cae a la primera categoría, para no mandar "" (el backend la rechaza).
  const categoryCode = pickedCategory || catalog[0]?.code || ''

  function handleSubmit(e) {
    e.preventDefault()
    const payload = { transactionId: transaction.transactionId, amount: Number(amount), merchant: merchant.trim() }
    if (needsCategory) payload.categoryCode = categoryCode
    mutate(payload, { onSuccess: onClose })
  }

  const errorMessage =
    error?.response?.status === 409
      ? 'Este movimiento ya no se puede editar. Actualiza la lista.'
      : 'No se pudo guardar el gasto. Revisa los datos e intenta de nuevo.'

  // En un portal sobre <body>: la fila que lo abre es una tarjeta con backdrop-filter, que se
  // vuelve el contenedor de los hijos `fixed` y dejaría el modal recortado dentro de la fila.
  return createPortal(
    <Modal open={open} onClose={onClose} title={needsCategory ? 'Completar gasto' : 'Agregar comercio'} center>
      <form onSubmit={handleSubmit} className="space-y-4">
        {needsCategory && (
          <p className="text-sm text-off-white/60">
            Luki no pudo leer este correo. Escribe cuánto fue y en qué lo gastaste.
          </p>
        )}

        <div>
          <FieldLabel id="complete-amount" label="Monto (S/)" help="transactions.complete.amount" />
          <input
            id="complete-amount"
            className="input"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            required
            autoFocus={!amount}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel id="complete-merchant" label="¿En qué o a quién?" help="transactions.complete.merchant" />
          <input
            id="complete-merchant"
            className="input"
            required
            maxLength={100}
            autoFocus={Boolean(amount)}
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="ej. Almuerzo, Uber, Juan Pérez"
          />
        </div>

        {needsCategory && (
          <div>
            <FieldLabel id="complete-category" label="Categoría" help="transactions.complete.category" />
            <select
              id="complete-category"
              className="input"
              required
              value={categoryCode}
              onChange={(e) => setPickedCategory(e.target.value)}
            >
              {catalog.length === 0 && <option value="">Cargando categorías…</option>}
              {catalog.map((c) => (
                <option key={c.code} value={c.code} className="bg-midnight text-off-white">
                  {c.displayName}
                </option>
              ))}
            </select>
          </div>
        )}

        {isError && (
          <p role="alert" className="text-sm text-rose-300">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="subtle" size="sm" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={isPending} disabled={needsCategory && !categoryCode}>
            Guardar
          </Button>
        </div>
      </form>
    </Modal>,
    document.body
  )
}

export default CompleteExpenseModal
