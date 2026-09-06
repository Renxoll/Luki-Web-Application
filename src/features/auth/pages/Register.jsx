import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useRegister } from '../api/useRegister'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '../../../components/Button'
import { PasswordInput } from '../../../components/PasswordInput'

export function Register() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { mutate, isPending, isError, error } = useRegister()

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) return
    mutate({ displayName, email, password })
  }

  // Mismo criterio que en Login: el backend corre en el plan free de Render y
  // se duerme tras 15 min de inactividad, así que un fallo sin respuesta 409
  // suele ser el cold start, no un dato inválido del formulario.
  const errorMessage =
    error?.response?.status === 409
      ? 'Ya existe una cuenta registrada con ese email.'
      : error?.response
        ? 'No se pudo crear la cuenta. Verifica tus datos e intenta de nuevo.'
        : 'No se pudo conectar con el servidor. Espera unos segundos e intenta de nuevo.'

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Toma menos de un minuto. Sin tarjeta."
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-neon-purple hover:brightness-125">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="label">
            Nombre
          </label>
          <input
            id="displayName"
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="input"
            placeholder="Tu nombre"
          />
        </div>

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
          <PasswordInput
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirmar contraseña
          </label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Repite tu contraseña"
            aria-invalid={passwordsMismatch}
          />
          {passwordsMismatch && (
            <p className="mt-1.5 text-xs text-rose-300">Las contraseñas no coinciden.</p>
          )}
        </div>

        {isError && (
          <p className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {errorMessage}
          </p>
        )}

        <Button type="submit" loading={isPending} disabled={passwordsMismatch} className="w-full">
          {isPending ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>

        <p className="text-center text-xs leading-relaxed text-off-white/40">
          Al crear tu cuenta aceptas los{' '}
          <Link to="/terms" className="link-muted">
            Términos
          </Link>{' '}
          y la{' '}
          <Link to="/privacy" className="link-muted">
            Política de Privacidad
          </Link>
          .
        </p>
      </form>
    </AuthLayout>
  )
}

export default Register
