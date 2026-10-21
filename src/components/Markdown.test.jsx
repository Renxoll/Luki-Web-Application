import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Markdown } from './Markdown'

describe('Markdown', () => {
  it('convierte **negritas** y listas en elementos, sin dejar los asteriscos a la vista', () => {
    const { container } = render(
      <Markdown>{'Gastaste **S/ 120.00** en comida.\n\n* Recorta delivery\n* Cocina en casa'}</Markdown>,
    )

    expect(screen.getByText('S/ 120.00').tagName).toBe('STRONG')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(container.textContent).not.toContain('**')
    expect(container.textContent).not.toContain('* ')
  })

  it('no interpreta HTML crudo que venga en la respuesta del LLM', () => {
    const { container } = render(<Markdown>{'Hola <img src=x onerror="alert(1)"> mundo'}</Markdown>)

    expect(container.querySelector('img')).toBeNull()
  })

  it('abre los enlaces en otra pestaña sin pasar el referrer', () => {
    render(<Markdown>{'[Luki](https://tuluki.com)'}</Markdown>)

    const link = screen.getByRole('link', { name: 'Luki' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noreferrer')
  })
})
