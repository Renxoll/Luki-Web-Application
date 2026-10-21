import { useSyncExternalStore } from 'react'

/** Suscripción a un media query; sin `matchMedia` (jsdom, SSR) devuelve `false`. */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (notify) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', notify)
      return () => mql.removeEventListener('change', notify)
    },
    () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false),
    () => false,
  )
}

/** Breakpoint `lg` de Tailwind: desde acá las pantallas "caben en una vista", sin scroll de página. */
export const DESKTOP_QUERY = '(min-width: 1024px)'

export function useIsDesktop() {
  return useMediaQuery(DESKTOP_QUERY)
}
