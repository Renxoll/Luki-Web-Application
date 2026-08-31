import { MarketingNav, MarketingFooter } from './MarketingNav'

/** Contenedor de las páginas legales: nav + columna de lectura + footer. */
export function LegalLayout({ title, updatedAt, children }) {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        {updatedAt && (
          <p className="mt-2 text-sm text-off-white/45">Última actualización: {updatedAt}</p>
        )}
        <div className="legal mt-8 space-y-6 text-sm leading-relaxed text-off-white/70">
          {children}
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}

/** Sección con encabezado h2. */
export function LegalSection({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-off-white">{title}</h2>
      {children}
    </section>
  )
}

export default LegalLayout
