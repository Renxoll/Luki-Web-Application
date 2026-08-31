import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useLogin } from '../api/useLogin'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '../../../components/Button'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, isError, error } = useLogin()

  function handleSubmit(e) {
    e.preventDefault()
    mutate({ email, password })
  }

  // El backend corre en el plan free de Render, que se duerme tras 15 min de
  // inactividad: un 401 es realmente una credencial inválida, pero cualquier
  // otro fallo (503, timeout, sin respuesta) suele ser el cold start, no un
  // typo del usuario, así que hay que decirle que reintente en vez de
  // hacerle dudar de su contraseña.
  const errorMessage =
    error?.response?.status === 401
      ? 'Credenciales inválidas. Verifica tu email y contraseña.'
      : 'No se pudo conectar con el servidor. Espera unos segundos e intenta de nuevo.'

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Inicia sesión para ver tu resumen del mes."
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-neon-purple hover:brightness-125">
            Crear cuenta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
            placeholder="••••••••"
          />
        </div>

        {isError && (
          <p className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {errorMessage}
          </p>
        )}

        <Button type="submit" loading={isPending} className="w-full">
          {isPending ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default Login
