import { Link } from 'react-router-dom'
import { Logo } from '../../../components/Logo'
import { Button } from '../../../components/Button'

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-midnight/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="Inicio">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-off-white/70 transition hover:text-off-white"
          >
            Iniciar sesión
          </Link>
          <Button to="/register" size="sm">
            Crear cuenta
          </Button>
        </div>
      </div>
    </header>
  )
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/[0.06] px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-off-white/45 sm:flex-row">
        <div className="flex items-center gap-2">
          <Logo size={24} />
          <span className="text-off-white/35">© {new Date().getFullYear()}</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link to="/privacy" className="link-muted">
            Privacidad
          </Link>
          <Link to="/terms" className="link-muted">
            Términos
          </Link>
          <Link to="/login" className="link-muted">
            Iniciar sesión
          </Link>
          <a href="mailto:llerenarenzo123@gmail.com" className="link-muted">
            Contacto
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default MarketingNav
