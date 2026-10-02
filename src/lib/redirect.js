/**
 * Navegación completa del navegador a otro sitio (p. ej. Stripe Checkout). Aparte en su propio
 * módulo para poder reemplazarla en los tests: jsdom no permite redefinir `window.location`.
 */
export function redirectTo(url) {
  window.location.assign(url)
}
