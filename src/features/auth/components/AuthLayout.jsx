import { Link } from 'react-router-dom'
import { Mail, Sparkles, ShieldCheck } from 'lucide-react'
import { Logo } from '../../../components/Logo'

const POINTS = [
  { icon: Mail, text: 'Conecta tu Gmail y Luki lee las notificaciones de tu banco por ti.' },
  { icon: Sparkles, text: 'Cada gasto se categoriza solo, con un asesor con IA a un toque.' },
  { icon: ShieldCheck, text: 'Acceso de solo lectura y tokens cifrados. Desconecta cuando quieras.' },
]

/** Pantalla de autenticación: panel de marca (desktop) + tarjeta de formulario. */
export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Panel de marca */}
      <div className="relative hidden overflow-hidden border-r border-white/[0.06] p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 -z-10 bg-brand-fade" />
        <div className="absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-neon-purple/25 blur-3xl" />
        <Link to="/">
          <Logo size={36} />
        </Link>

        <div className="max-w-md">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Tus finanzas del mes, <span className="gradient-text">claras</span>. Sin tipear nada.
          </h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-off-white/70">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-neon-purple">
                  <Icon size={16} strokeWidth={2.2} />
                </span>
                <span className="pt-1.5">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-off-white/40">© {new Date().getFullYear()} Luki · tuluki.com</p>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8 lg:hidden">
            <Link to="/">
              <Logo size={34} />
            </Link>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-off-white/55">{subtitle}</p>}

          <div className="mt-7">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-off-white/55">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
