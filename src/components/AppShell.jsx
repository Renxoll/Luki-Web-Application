import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Users, Sparkles, LogOut, Crown } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useWorkspaceStore } from '../store/useWorkspaceStore'
import { Logo } from './Logo'
import { LogoutOverlay } from './LogoutOverlay'

// Debe coincidir con la duración de animate-fade-in del velo (ver tailwind.config.js) más
// un pequeño margen para que el usuario alcance a leer "Cerrando sesión…" antes del salto.
const LOGOUT_TRANSITION_MS = 550

const NAV = [
  { to: '/dashboard', label: 'Resumen', icon: LayoutDashboard },
  { to: '/transactions', label: 'Movimientos', icon: ArrowLeftRight },
  { to: '/groups', label: 'Grupos', icon: Users },
  { to: '/advisor', label: 'Luki AI', icon: Sparkles },
]

function navClass({ isActive }) {
  return `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-white/10 text-off-white' : 'text-off-white/55 hover:bg-white/5 hover:text-off-white/90'
  }`
}

function mobileNavClass({ isActive }) {
  return `flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition ${
    isActive ? 'text-neon-purple' : 'text-off-white/50'
  }`
}

/**
 * Layout de las pantallas autenticadas: barra superior con marca + navegación + logout,
 * contenedor central con ancho máximo, y navegación inferior en móvil.
 */
export function AppShell({ children, maxWidth = 'max-w-3xl' }) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  function handleLogout() {
    if (isLoggingOut) return
    // El velo se monta primero y recién después de que termina de animarse se limpia la
    // sesión y se navega -- así el corte a /login no se siente instantáneo.
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      useWorkspaceStore.getState().reset()
      navigate('/login', { replace: true })
    }, LOGOUT_TRANSITION_MS)
  }

  const initial = (user?.email || 'U').charAt(0).toUpperCase()

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-midnight/80 backdrop-blur-xl">
        <div className={`mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 ${maxWidth}`}>
          <NavLink to="/dashboard" aria-label="Ir al resumen">
            <Logo />
          </NavLink>

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={navClass}>
                <Icon size={16} strokeWidth={2.2} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <NavLink
              to="/subscription"
              className={({ isActive }) =>
                `rounded-lg p-2 transition hover:bg-white/5 ${
                  isActive ? 'text-neon-purple' : 'text-off-white/50 hover:text-off-white'
                }`
              }
              aria-label="Plan y facturación"
              title="Plan y facturación"
            >
              <Crown size={17} strokeWidth={2.2} />
            </NavLink>
            <span
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-semibold text-off-white/80"
              title={user?.email}
            >
              {initial}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-lg p-2 text-off-white/50 transition hover:bg-white/5 hover:text-off-white disabled:pointer-events-none disabled:opacity-40"
              aria-label="Cerrar sesión"
            >
              <LogOut size={17} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </header>

      <main className={`mx-auto px-4 py-8 sm:px-6 ${maxWidth}`}>{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-white/10 bg-midnight/95 backdrop-blur-xl sm:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={mobileNavClass}>
            <Icon size={20} strokeWidth={2.1} />
            {label}
          </NavLink>
        ))}
      </nav>

      {isLoggingOut && <LogoutOverlay />}
    </div>
  )
}

export default AppShell
