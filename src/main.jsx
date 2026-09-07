import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

// Datos "vivos": la ingesta de gastos ocurre en el backend (sync de Gmail, correos
// reenviados) sin que el frontend se entere. Con esto, volver a la pestaña o reconectar
// re-consulta solo, y no hace falta cerrar/abrir sesión para ver gastos nuevos. El polling
// fino (cada ~45s) vive en los hooks de movimientos y resumen, no acá.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      staleTime: 15_000,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
