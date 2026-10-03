import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    // Los tests nunca deben pegarle al backend real: apiClient o los módulos *Api.js se mockean.
    env: { VITE_API_BASE_URL: 'http://api.test/api/v1' },
  },
})
