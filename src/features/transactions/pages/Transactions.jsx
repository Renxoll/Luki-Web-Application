import { useNavigate } from 'react-router-dom'
import { TransactionList } from '../components/TransactionList'

export function Transactions() {
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
          <h1 className="text-xl font-semibold">Tus transacciones</h1>
        </div>

        <TransactionList />
      </div>
    </div>
  )
}

export default Transactions
