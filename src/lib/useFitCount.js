import { useLayoutEffect, useState } from 'react'
import { useIsDesktop } from './useMediaQuery'

/**
 * Cuántos elementos de `itemHeight` px (alto + separación) caben en el contenedor al que se
 * le pone el `ref` (callback ref: funciona aunque el contenedor se monte más tarde). El contenedor tiene que recibir su alto del layout (`flex-1 min-h-0`), no
 * de su contenido -- si no, mide lo que ya pintó y nunca se achica.
 *
 * Solo aplica en escritorio, donde la pantalla es de alto fijo y no se scrollea la página.
 * Fuera de escritorio devuelve `fallback` de entrada. En escritorio devuelve `null` hasta la
 * primera medición, para que quien lo use no pida datos con un tamaño que va a cambiar.
 */
export function useFitCount({ itemHeight, fallback, min = 3, max = 50 }) {
  const [element, ref] = useState(null)
  const isDesktop = useIsDesktop()
  const [measured, setMeasured] = useState(null)

  useLayoutEffect(() => {
    if (!isDesktop || !element) return undefined

    const measure = () => {
      const fit = Math.floor(element.clientHeight / itemHeight)
      setMeasured(Math.min(max, Math.max(min, fit)))
    }
    measure()

    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [isDesktop, element, itemHeight, min, max])

  return { ref, isDesktop, count: isDesktop ? measured : fallback }
}
