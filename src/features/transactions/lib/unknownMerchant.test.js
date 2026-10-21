import { describe, expect, it } from 'vitest'
import { isUnknownMerchant, needsManualDetails } from './unknownMerchant'

describe('isUnknownMerchant', () => {
  it('trata vacío, nulo y "Desconocido" del LLM como comercio desconocido', () => {
    expect(isUnknownMerchant(null)).toBe(true)
    expect(isUnknownMerchant('   ')).toBe(true)
    expect(isUnknownMerchant('Desconocido')).toBe(true)
    expect(isUnknownMerchant(' desconocido ')).toBe(true)
  })

  it('no confunde un comercio real que contiene la palabra', () => {
    expect(isUnknownMerchant('Starbucks')).toBe(false)
    expect(isUnknownMerchant('Tienda Desconocido SAC')).toBe(false)
  })
})

describe('needsManualDetails', () => {
  const base = { status: 'PROCESSED', type: 'EXPENSE', internalTransfer: false, merchant: 'Starbucks' }

  it('ofrece completar a mano un gasto que no se pudo leer', () => {
    expect(needsManualDetails({ ...base, status: 'FAILED', merchant: null })).toBe(true)
  })

  it('ofrece agregar el comercio de un gasto leído sin comercio', () => {
    expect(needsManualDetails({ ...base, merchant: 'Desconocido' })).toBe(true)
  })

  it('no lo ofrece con comercio conocido, ni mientras procesa, ni en ingresos o transferencias propias', () => {
    expect(needsManualDetails(base)).toBe(false)
    expect(needsManualDetails({ ...base, status: 'PENDING', merchant: null })).toBe(false)
    expect(needsManualDetails({ ...base, type: 'INCOME', merchant: null })).toBe(false)
    expect(needsManualDetails({ ...base, merchant: null, internalTransfer: true })).toBe(false)
    expect(needsManualDetails({ ...base, status: 'FAILED', internalTransfer: true })).toBe(false)
  })
})
