import { Link } from 'react-router-dom'
import { Spinner } from './Spinner'

const VARIANTS = {
  primary:
    'bg-brand-gradient text-white shadow-glow hover:brightness-110 focus-visible:ring-neon-purple/50',
  mint: 'bg-electric-mint text-slate-900 hover:brightness-110 focus-visible:ring-electric-mint/50',
  ghost:
    'border border-white/12 bg-white/[0.04] text-off-white/85 hover:bg-white/[0.09] hover:text-off-white focus-visible:ring-white/20',
  subtle:
    'bg-white/[0.06] text-off-white/80 hover:bg-white/[0.12] focus-visible:ring-white/20',
  danger:
    'border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 focus-visible:ring-rose-500/40',
}

const SIZES = {
  sm: 'h-9 px-3.5 text-xs gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-sm gap-2',
}

/**
 * Botón unificado. Renderiza <button>, <Link> (prop `to`) o <a> (prop `href`).
 * `loading` muestra spinner y bloquea el click; `icon` es un componente de lucide-react.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight = false,
  to,
  href,
  className = '',
  children,
  disabled,
  ...rest
}) {
  const cls = `inline-flex items-center justify-center rounded-xl font-semibold transition
    outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-55
    ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  const content = (
    <>
      {loading ? (
        <Spinner size={size === 'sm' ? 14 : 16} />
      ) : (
        Icon && !iconRight && <Icon size={size === 'sm' ? 15 : 17} strokeWidth={2.2} />
      )}
      {children}
      {!loading && Icon && iconRight && <Icon size={size === 'sm' ? 15 : 17} strokeWidth={2.2} />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  )
}

export default Button
