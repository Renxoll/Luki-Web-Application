import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, MailCheck } from 'lucide-react'
import { useRequestPasswordReset } from '../api/usePasswordReset'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '../../../components/Button'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const { mutate, isPending, isSuccess, isError } = useRequestPasswordReset()

  function handleSubmit(e) {
    e.preventDefault()
    mutate({ email })
  }

  return (
    <AuthLayout
      title="¿Olvidaste tu contraseña?"
      subtitle="Te enviamos un enlace para elegir una nueva."
      footer={
        <>
          ¿Ya la recordaste?{' '}
          <Link to="/login" className="font-semibold text-neon-purple hover:brightness-125">
            Inicia sesión
          </Link>
        </>
      }
    >
      {isSuccess ? (
        <div className="rounded-xl border border-electric-mint/25 bg-electric-mint/10 px-4 py-5 text-sm text-off-white/80">
          <MailCheck size={20} className="mb-2 text-electric-mint" />
          <p className="font-medium text-off-white">Revisa tu correo</p>
          <p className="mt-1 text-off-white/60">
            Si <span className="text-off-white/80">{email}</span> tiene una cuenta, te llegó un enlace para
            restablecer tu contraseña. Vence en 30 minutos. Mira también en spam.
          </p>
        </div>
      ) : (
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

          {isError && (
            <p className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              No se pudo conectar con el servidor. Espera unos segundos e intenta de nuevo.
            </p>
          )}

          <Button type="submit" loading={isPending} className="w-full">
            {isPending ? 'Enviando…' : 'Enviarme el enlace'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}

export default ForgotPassword
