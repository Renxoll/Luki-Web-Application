import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Field } from './Field'
import { FIELD_HELP } from '../lib/fieldHelp'

function renderField(help = 'transactions.expense.amount') {
  return render(
    <div data-testid="card">
      <Field id="amount" label="Monto (S/)" help={help}>
        <input id="amount" />
      </Field>
    </div>,
  )
}

describe('FieldHelp (ayuda electrónica por campo)', () => {
  it('al pulsar la ayuda despliega el concepto, la forma de uso y un ejemplo del campo', async () => {
    renderField()

    await userEvent.click(screen.getByRole('button', { name: 'Ayuda sobre Monto (S/)' }))

    const help = FIELD_HELP['transactions.expense.amount']
    const dialog = await screen.findByRole('dialog', { name: `Ayuda: ${help.title}` })
    expect(dialog).toHaveTextContent('Qué es')
    expect(dialog).toHaveTextContent(help.concept)
    expect(dialog).toHaveTextContent('Cómo completarlo')
    expect(dialog).toHaveTextContent(help.usage)
    expect(dialog).toHaveTextContent(help.example)
  })

  it('se pinta fuera de la tarjeta (portal) para que nada la recorte o tape', async () => {
    renderField()

    await userEvent.click(screen.getByRole('button', { name: 'Ayuda sobre Monto (S/)' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog.closest('[data-testid="card"]')).toBeNull()
  })

  it('expone su estado a lectores de pantalla y se opera con teclado', async () => {
    renderField()
    const button = screen.getByRole('button', { name: 'Ayuda sobre Monto (S/)' })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    button.focus()
    await userEvent.keyboard('{Enter}')

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAttribute('aria-controls', (await screen.findByRole('dialog')).id)
  })

  it('se cierra con Escape devolviendo el foco al botón, y al pulsar fuera', async () => {
    renderField()
    const button = screen.getByRole('button', { name: 'Ayuda sobre Monto (S/)' })

    await userEvent.click(button)
    await screen.findByRole('dialog')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(button).toHaveFocus()

    await userEvent.click(button)
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(dialog.previousElementSibling) // el velo transparente
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('el rótulo sigue enlazado al campo', () => {
    renderField()

    expect(screen.getByLabelText('Monto (S/)')).toHaveAttribute('id', 'amount')
  })

  it('una clave inexistente no rompe el formulario: simplemente no muestra ayuda', () => {
    renderField('no.existe')

    expect(screen.queryByRole('button', { name: /Ayuda sobre/ })).toBeNull()
    expect(screen.getByLabelText('Monto (S/)')).toBeInTheDocument()
  })
})
