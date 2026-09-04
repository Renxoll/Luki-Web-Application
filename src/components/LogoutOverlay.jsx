import { Logo } from './Logo'

/**
 * Se monta un instante antes de limpiar la sesión y navegar a /login (ver
 * `AppShell.handleLogout`): tapa toda la pantalla para que ese salto no se sienta como un
 * corte seco. `animate-fade-in` cubre la entrada del velo y `animate-zoom-fade` la de la
 * marca, con el mismo timing que usa `AppShell` antes de navegar.
 */
export function LogoutOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-midnight animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 animate-zoom-fade">
        <Logo withWordmark={false} size={56} />
        <p className="text-sm font-medium text-off-white/60">Cerrando sesión…</p>
      </div>
    </div>
  )
}

export default LogoutOverlay
