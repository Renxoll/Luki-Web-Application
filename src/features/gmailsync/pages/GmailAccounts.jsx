import { useNavigate } from 'react-router-dom'
import { GmailAccountsPanel } from '../components/GmailAccountsPanel'

export function GmailAccounts() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-midnight px-4 py-8 text-off-white sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-off-white/60 transition hover:text-off-white"
            aria-label="Volver al dashboard"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold">Cuentas de Gmail conectadas</h1>
        </div>

        <GmailAccountsPanel />
      </div>
    </div>
  )
}

export default GmailAccounts
