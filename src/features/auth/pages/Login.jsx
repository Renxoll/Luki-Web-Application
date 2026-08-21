import { useState } from 'react'
import { useLogin } from '../api/useLogin'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, isError } = useLogin()

  function handleSubmit(e) {
    e.preventDefault()
    mutate({ email, password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 text-slate-50">
      <div className="w-full max-w-sm rounded-2xl bg-white/5 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold">Luki</h1>
        <p className="mt-1 text-sm text-slate-400">
          Inicia sesión para ver tu resumen financiero.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-slate-400">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••"
            />
          </div>

          {isError && (
            <p className="text-sm text-red-400/90">
              Credenciales inválidas. Verifica tu email y contraseña.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
