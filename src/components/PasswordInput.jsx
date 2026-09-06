import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Campo de contraseña con toggle de visibilidad. Drop-in del `<input className="input">`
 * de siempre: reserva espacio a la derecha (`pr-11`) para el botón del ojo. El botón queda
 * fuera del tab order (`tabIndex={-1}`) para no cortar el flujo email → contraseña → enviar.
 */
export function PasswordInput({ className = '', ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input type={visible ? 'text' : 'password'} className={`input pr-11 ${className}`} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center text-off-white/40 transition hover:text-off-white/80"
      >
        {visible ? <EyeOff size={17} strokeWidth={2.2} /> : <Eye size={17} strokeWidth={2.2} />}
      </button>
    </div>
  )
}

export default PasswordInput
