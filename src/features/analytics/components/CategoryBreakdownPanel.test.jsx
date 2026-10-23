import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CategoryBreakdownPanel } from './CategoryBreakdownPanel'

const ITEMS = ['Comida', 'Transporte', 'Salud', 'Compras', 'Otros'].map((name, i) => ({
  categoryId: String(i),
  categoryName: name,
  amount: 500 - i * 100,
  percentage: 20,
}))

let containerHeight

describe('CategoryBreakdownPanel (fit)', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(() => containerHeight)
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    globalThis.ResizeObserver = class {
      observe() {}
      disconnect() {}
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete window.matchMedia
    delete globalThis.ResizeObserver
  })

  it('muestra todas las categorías cuando entran', () => {
    containerHeight = 46 * 5
    render(<CategoryBreakdownPanel items={ITEMS} currency="PEN" fit />)

    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.queryByText(/categorías? más/)).toBeNull()
  })

  it('si no caben, muestra las que entran y resume el resto con su monto', () => {
    containerHeight = 46 * 3 // 2 categorías + la fila de resumen
    render(<CategoryBreakdownPanel items={ITEMS} currency="PEN" fit />)

    expect(screen.getByText('Comida')).toBeInTheDocument()
    expect(screen.getByText('Transporte')).toBeInTheDocument()
    expect(screen.queryByText('Salud')).toBeNull()
    expect(screen.getByText('3 categorías más')).toBeInTheDocument()
    // Salud 300 + Compras 200 + Otros 100
    expect(screen.getByText(/600[.,]00/)).toBeInTheDocument()
  })

  it('sin `fit` muestra todas, aunque el contenedor sea chico', () => {
    containerHeight = 10
    render(<CategoryBreakdownPanel items={ITEMS} currency="PEN" />)

    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })
})
