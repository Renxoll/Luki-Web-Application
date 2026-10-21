import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { useFitCount } from './useFitCount'

// jsdom no hace layout: se simulan el media query de escritorio, el alto del contenedor y el
// ResizeObserver para comprobar la cuenta, no el CSS.
let observerCallback
let containerHeight

function Probe(options) {
  const { ref, count } = useFitCount(options)
  return (
    <div ref={ref} data-testid="box">
      {String(count)}
    </div>
  )
}

function mockDesktop(matches) {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

describe('useFitCount', () => {
  beforeEach(() => {
    containerHeight = 520
    observerCallback = undefined
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(() => containerHeight)
    globalThis.ResizeObserver = class {
      constructor(callback) {
        observerCallback = callback
      }
      observe() {}
      disconnect() {}
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete window.matchMedia
    delete globalThis.ResizeObserver
  })

  it('en escritorio devuelve cuántos elementos caben en el alto del contenedor', () => {
    mockDesktop(true)
    render(<Probe itemHeight={64} fallback={10} />)

    expect(screen.getByTestId('box')).toHaveTextContent('8') // floor(520 / 64)
  })

  it('se recalcula cuando el contenedor cambia de tamaño', () => {
    mockDesktop(true)
    render(<Probe itemHeight={64} fallback={10} />)

    containerHeight = 330
    act(() => observerCallback())

    expect(screen.getByTestId('box')).toHaveTextContent('5')
  })

  it('respeta el mínimo y el máximo', () => {
    mockDesktop(true)
    containerHeight = 40
    const { unmount } = render(<Probe itemHeight={64} fallback={10} min={3} max={30} />)
    expect(screen.getByTestId('box')).toHaveTextContent('3')
    unmount()

    containerHeight = 5000
    render(<Probe itemHeight={64} fallback={10} min={3} max={30} />)
    expect(screen.getByTestId('box')).toHaveTextContent('30')
  })

  it('fuera de escritorio usa el valor de respaldo sin medir', () => {
    mockDesktop(false)
    render(<Probe itemHeight={64} fallback={10} />)

    expect(screen.getByTestId('box')).toHaveTextContent('10')
  })
})
