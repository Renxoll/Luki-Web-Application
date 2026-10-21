import { describe, expect, it } from 'vitest'
import { workspaceErrorMessage } from './workspaceError'

const FALLBACK = 'No se pudo guardar el módulo.'

function httpError(status, data) {
  return Object.assign(new Error(`HTTP ${status}`), { response: { status, data } })
}

describe('workspaceErrorMessage', () => {
  it('muestra el mensaje del backend en un 409', () => {
    expect(workspaceErrorMessage(httpError(409, { message: 'Ya existe esa categoría' }), FALLBACK)).toBe(
      'Ya existe esa categoría',
    )
  })

  it('cae al texto genérico si el 409 no trae mensaje', () => {
    expect(workspaceErrorMessage(httpError(409, {}), FALLBACK)).toBe(FALLBACK)
    expect(workspaceErrorMessage(httpError(409, { message: '  ' }), FALLBACK)).toBe(FALLBACK)
  })

  it('no expone el mensaje de otros códigos (500, 400...)', () => {
    expect(workspaceErrorMessage(httpError(500, { message: 'NullPointerException' }), FALLBACK)).toBe(FALLBACK)
  })

  it('cae al texto genérico en un error de red', () => {
    expect(workspaceErrorMessage(new Error('Network Error'), FALLBACK)).toBe(FALLBACK)
  })
})
