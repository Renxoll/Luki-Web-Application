import { Navigate } from 'react-router-dom'
import {
  Mail,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Wallet,
  Bot,
  Zap,
  Lock,
  ArrowRight,
} from 'lucide-react'
import { useAuthStore } from '../../../store/useAuthStore'
import { Button } from '../../../components/Button'
import { MarketingNav, MarketingFooter } from '../components/MarketingNav'

const STEPS = [
  {
    icon: Mail,
    title: 'Conecta tu Gmail',
    text: 'Un clic y acceso de solo lectura. Luki no manda correos ni toca nada más.',
  },
  {
    icon: Zap,
    title: 'Luki lee tus alertas del banco',
    text: 'BCP, Interbank, BBVA, Yape, Plin… cada notificación se vuelve un movimiento.',
  },
  {
    icon: BarChart3,
    title: 'Mira tu mes, claro',
    text: 'Gastos categorizados, comparado con el mes pasado, sin haber tipeado nada.',
  },
]

const FEATURES = [
  { icon: Sparkles, title: 'Categorización automática', text: 'Cada gasto cae en su categoría solo. Corrige uno y listo.' },
  { icon: Bot, title: 'Asesor con IA', text: '“¿En qué se me fue la plata?” — respuesta anclada en tus números.' },
  { icon: Wallet, title: 'Multibanco Perú', text: 'Bancos y billeteras del país en un solo resumen.' },
  { icon: BarChart3, title: 'Resumen del mes', text: 'Ingresos, gastos, balance y tendencia vs. el mes anterior.' },
  { icon: Lock, title: 'Tokens cifrados', text: 'Tus credenciales de Google se guardan cifradas (AES-256-GCM).' },
  { icon: ShieldCheck, title: 'Tú tienes el control', text: 'Desconecta tu Gmail o borra tu cuenta cuando quieras.' },
]

function ProductMock() {
  return (
    <div className="relative mx-auto w-full max-w-md animate-float">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-neon-purple/20 blur-3xl" />
      <div className="rounded-3xl border border-white/10 bg-midnight-800/80 p-5 shadow-card backdrop-blur">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 p-5">
          <div className="absolute inset-0 -z-10 bg-brand-fade" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-off-white/45">
            Balance neto de este mes
          </p>
          <p className="mt-1.5 text-3xl font-extrabold tracking-tight">S/ 1,240.00</p>
          <div className="mt-3 flex gap-2">
            <span className="chip text-[11px]">Ingresos S/ 4,000</span>
            <span className="chip text-[11px] text-orange-300">Gastos S/ 2,760</span>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {[
            ['Compras', 43, 'bg-violet-400'],
            ['Restaurantes', 28, 'bg-emerald-400'],
            ['Transporte', 16, 'bg-sky-400'],
          ].map(([label, pct, bar]) => (
            <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{label}</span>
                <span className="text-off-white/50">{pct}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Landing() {
  const token = useAuthStore((state) => state.token)
  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="absolute -right-24 top-0 -z-10 h-80 w-80 rounded-full bg-electric-mint/15 blur-3xl" />
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="chip">
              <Sparkles size={13} className="text-neon-purple" /> Finanzas personales, en piloto automático
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Tus finanzas del mes, <span className="gradient-text">claras</span>.
              <br />
              Sin tipear nada.
            </h1>
            <p className="mt-5 max-w-md text-base text-off-white/60">
              Luki lee las notificaciones de tu banco y billetera desde tu correo y arma tu resumen
              de gastos. Con un asesor con IA para preguntarle lo que quieras.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to="/register" size="lg" icon={ArrowRight} iconRight>
                Crear cuenta gratis
              </Button>
              <Button to="/login" size="lg" variant="ghost">
                Ya tengo cuenta
              </Button>
            </div>
            <p className="mt-4 text-xs text-off-white/40">
              Acceso de solo lectura a tu Gmail · Sin tarjeta · Cancela cuando quieras
            </p>
          </div>

          <div className="lg:pl-6">
            <ProductMock />
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="section-title text-center">Cómo funciona</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-2xl font-bold tracking-tight">
            Tres pasos y no vuelves a llenar una planilla
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <span className="text-xs font-semibold text-off-white/40">Paso {i + 1}</span>
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-off-white/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="section-title text-center">Todo automático</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-2xl font-bold tracking-tight">
            Lo que otras apps te hacen tipear, Luki lo lee
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card card-hover p-5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.06] text-neon-purple">
                  <Icon size={17} strokeWidth={2.2} />
                </span>
                <h3 className="mt-3.5 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-off-white/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-4 py-16 sm:px-6">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 p-10 text-center sm:p-14">
          <div className="absolute inset-0 -z-10 bg-brand-fade" />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Mira en qué se te va la plata este mes
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-off-white/60">
            Conecta tu Gmail y en un rato tienes tu primer resumen. Gratis.
          </p>
          <div className="mt-7 flex justify-center">
            <Button to="/register" size="lg" icon={ArrowRight} iconRight>
              Empezar ahora
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

export default Landing
