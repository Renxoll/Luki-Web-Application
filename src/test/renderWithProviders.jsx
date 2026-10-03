import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

/**
 * Renderiza una pantalla con lo mismo que le da main.jsx (QueryClient) y un router en memoria.
 * `path` es el patrón de la ruta y `url` la URL inicial (con query string si hace falta).
 * Cada test recibe un QueryClient nuevo y sin reintentos por defecto, para que una query no
 * herede cache de otro test.
 */
export function renderWithProviders(element, { path = '/', url = path } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path={path} element={element} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
  return { ...result, queryClient }
}
