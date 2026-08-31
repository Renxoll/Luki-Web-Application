import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, SendHorizonal } from 'lucide-react'
import { useAskAdvisor } from '../api/useAskAdvisor'

const WELCOME_MESSAGE = {
  role: 'luki',
  content: 'Hola, soy Luki. Pregúntame lo que quieras sobre tus gastos de este mes.',
}

const SUGGESTIONS = [
  '¿En qué se me fue la plata este mes?',
  '¿Gasté más que el mes pasado?',
  '¿Qué categoría debería recortar?',
]

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-dot-bounce" />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-dot-bounce [animation-delay:0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-dot-bounce [animation-delay:0.3s]" />
    </span>
  )
}

function LukiAvatar() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">
      <Sparkles size={15} strokeWidth={2.3} />
    </span>
  )
}

export function AdvisorChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const { mutate, isPending } = useAskAdvisor()

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending])

  function send(text) {
    const value = text.trim()
    if (!value || isPending) return

    setMessages((prev) => [...prev, { role: 'user', content: value }])
    setInput('')

    mutate(value, {
      onSuccess: (data) => {
        const reply = data?.reply?.trim()
        setMessages((prev) => [
          ...prev,
          { role: 'luki', content: reply || 'No pude generar una respuesta para eso. Intenta reformular tu pregunta.' },
        ])
      },
      onError: () => {
        setMessages((prev) => [
          ...prev,
          { role: 'luki', content: 'No pude procesar tu pregunta. Inténtalo de nuevo.' },
        ])
      },
    })
  }

  const showSuggestions = messages.length === 1 && !isPending

  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] bg-midnight/80 px-4 py-3.5 backdrop-blur-xl sm:px-6">
        <Link
          to="/dashboard"
          className="rounded-lg p-1.5 text-off-white/50 transition hover:bg-white/5 hover:text-off-white"
          aria-label="Volver al resumen"
        >
          <ArrowLeft size={20} strokeWidth={2.2} />
        </Link>
        <LukiAvatar />
        <div>
          <h1 className="text-sm font-semibold leading-tight">Luki AI</h1>
          <p className="text-xs text-off-white/45">Tu asesor financiero</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'luki' && <LukiAvatar />}
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-br-md bg-white/10 text-off-white'
                    : 'rounded-bl-md border border-electric-mint/25 bg-electric-mint/[0.07] text-off-white'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isPending && (
            <div className="flex items-end gap-2.5">
              <LukiAvatar />
              <div className="rounded-2xl rounded-bl-md border border-neon-purple/25 bg-neon-purple/[0.07] px-4 py-3.5 text-neon-purple/80">
                <TypingDots />
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="mt-1 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-xs text-off-white/70 transition hover:border-neon-purple/40 hover:bg-white/[0.09] hover:text-off-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="shrink-0 border-t border-white/[0.06] bg-midnight/80 px-4 py-4 backdrop-blur-xl sm:px-6"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta a Luki…"
            disabled={isPending}
            className="flex-1 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-off-white placeholder:text-off-white/35 outline-none transition focus:border-neon-purple/50 focus:ring-2 focus:ring-neon-purple/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isPending || !input.trim()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-gradient text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Enviar"
          >
            <SendHorizonal size={18} strokeWidth={2.2} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdvisorChat
