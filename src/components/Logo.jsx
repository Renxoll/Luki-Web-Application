/**
 * Marca de Luki: cuadrado con gradiente + glifo de "chispa/moneda", y wordmark opcional.
 * `size` controla el lado del cuadrado en px; el texto escala con él.
 */
export function Logo({ withWordmark = true, size = 32, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="grid place-items-center rounded-xl bg-brand-gradient text-white shadow-glow"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg
          width={size * 0.58}
          height={size * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v18" />
          <path d="M17 6.5c-1-1.2-2.7-2-5-2-3 0-5 1.5-5 3.7 0 5 10 2.6 10 7.6 0 2.3-2.2 3.7-5 3.7-2.3 0-4-.8-5-2" />
        </svg>
      </span>
      {withWordmark && (
        <span className="text-lg font-bold tracking-tight text-off-white">Luki</span>
      )}
    </span>
  )
}

export default Logo
