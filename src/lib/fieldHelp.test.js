import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { FIELD_HELP } from './fieldHelp'

const SRC = join(__dirname, '..')

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.jsx?$/.test(name) && !/\.test\./.test(name) ? [path] : []
  })
}

describe('catálogo de ayuda por campo', () => {
  it('cada entrada explica el concepto y la forma de uso', () => {
    for (const [key, entry] of Object.entries(FIELD_HELP)) {
      expect(entry.title, key).toBeTruthy()
      expect(entry.concept.length, `${key}: concepto`).toBeGreaterThan(20)
      expect(entry.usage.length, `${key}: forma de uso`).toBeGreaterThan(20)
    }
  })

  it('toda clave `help="..."` usada en la app existe en el catálogo', () => {
    const used = new Set()
    for (const file of sourceFiles(SRC)) {
      for (const match of readFileSync(file, 'utf8').matchAll(/help(?:Key)?="([^"]+)"/g)) used.add(match[1])
    }

    expect(used.size).toBeGreaterThan(15)
    for (const key of used) expect(FIELD_HELP[key], `falta la ayuda "${key}"`).toBeDefined()
  })

  it('todas las entradas del catálogo se usan en algún campo (sin ayudas huérfanas)', () => {
    const text = sourceFiles(SRC)
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n')
    const orphans = Object.keys(FIELD_HELP).filter((key) => !text.includes(`"${key}"`))

    expect(orphans).toEqual([])
  })
})
