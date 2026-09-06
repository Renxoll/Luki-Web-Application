import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useConfirmPasswordReset } from '../api/usePasswordReset'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '../../../components/Button'
import { PasswordInput } from '../../../components/PasswordInput'

const REDIRECT_AFTER_SUCCESS_MS = 2500

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { mutate, isPending, isSuccess, error, isError } = useConfirmPasswordReset()

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  useEffect(() => {
    if (!isSuccess) return
    const t = setTimeout(() => navigate('/login', { replace: true }), REDIRECT_AFTER_SUCCESS_MS)
    return () => clearTimeout(t)
  }, [isSuccess, navigate])

  function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) return
    mutate({ token, password })
  }

  // 400 = token inválido / expirado / ya usado (mensaje único del backend). Cualquier otra
  // cosa (sin respuesta, 5xx) es el cold start de Render, no el enlace.
  const invalidLink = error?.response?.status === 400

  if (!token) {
    return (
      <AuthLayout title="Enlace incompleto" subtitle="Este enlace no trae un token de restablecimiento.">
        <p className="text-sm text-off-white/60">
          Pedí uno nuevo desde{' '}
          <Link to="/forgot-password" className="font-semibold text-neon-purple hover:brightness-125">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </AuthLayout>
    )
  }

  if (isSuccess) {
    return (
      <AuthLayout title="Contraseña actualizada" subtitle="Ya puedes iniciar sesión con la nueva.">
        <div className="rounded-xl border border-electric-mint/25 bg-electric-mint/10 px-4 py-5 text-sm text-off-white/80">
          <CheckCircle2 size={20} className="mb-2 text-electric-mint" />
          <p>Listo. Te llevamos a iniciar sesión…</p>
        </div>
        <Button to="/login" variant="ghost" size="sm" className="mt-4">
          Ir a iniciar sesión
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Elige una contraseña nueva"
      subtitle="Con esto vuelves a entrar a tu cuenta."
      footer={
        <Link to="/login" className="font-semibold text-neon-purple hover:brightness-125">
          Volver a iniciar sesión
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="label">
            Contraseña nueva
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
            {invalidLink ? (
              <span>
                El enlace no es válido o expiró.{' '}
                <Link to="/forgot-password" className="font-semibold underline">
                  Pide uno nuevo
                </Link>
                .
              </span>
            ) : (
              'No se pudo conectar con el servidor. Espera unos segundos e intenta de nuevo.'
            )}
          </p>
        )}

        <Button type="submit" loading={isPending} disabled={passwordsMismatch} className="w-full">
          {isPending ? 'Guardando…' : 'Guardar contraseña'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default ResetPassword
