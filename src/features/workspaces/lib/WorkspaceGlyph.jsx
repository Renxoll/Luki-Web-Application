import { createElement } from 'react'
import { resolveIcon } from './workspaceTheme'

/**
 * Renderiza el ícono de un módulo o categoría por su nombre (kebab o no). `resolveIcon`
 * devuelve un componente de lucide-react ya existente; se usa `createElement` para no
 * ligarlo a una variable local en cada punto de uso.
 */
export function WorkspaceGlyph({ name, size = 16, strokeWidth = 2.2, className }) {
  return createElement(resolveIcon(name), { size, strokeWidth, className })
}

export default WorkspaceGlyph
