import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Node 25 expone su propio `localStorage` global (Web Storage experimental) que, sin
// --localstorage-file, es un objeto sin métodos y tapa el de jsdom. Zustand (persist) lo usa
// para la sesión, así que se reemplaza por uno en memoria antes de que se importe cualquier store.
if (typeof globalThis.localStorage?.clear !== 'function') {
  const data = new Map()
  const memoryStorage = {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    clear: () => data.clear(),
    key: (index) => [...data.keys()][index] ?? null,
    get length() {
      return data.size
    },
  }
  Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage, configurable: true })
}

afterEach(() => {
  cleanup()
  localStorage.clear()
})
