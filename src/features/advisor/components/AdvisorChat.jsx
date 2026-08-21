import { useEffect, useRef, useState } from 'react'
import { useAskAdvisor } from '../api/useAskAdvisor'

const WELCOME_MESSAGE = {
  role: 'luki',
  content: 'Hola, soy Luki. Pregúntame lo que quieras sobre tus gastos de este mes.',
}

export function AdvisorChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const { mutate, isPending } = useAskAdvisor()

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending])

  function handleSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isPending) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')

    mutate(text, {
      onSuccess: (data) => {
        setMessages((prev) => [...prev, { role: 'luki', content: data.reply }])
      },
      onError: () => {
        setMessages((prev) => [
          ...prev,
          { role: 'luki', content: 'No pude procesar tu pregunta. Inténtalo de nuevo.' },
        ])
      },
    })
  }

  return (
    <div className="flex h-screen flex-col bg-[#0F172A] text-off-white">
      <header className="flex shrink-0 items-center gap-2 border-b border-white/10 px-6 py-4">
        <span className="h-2.5 w-2.5 rounded-full bg-neon-purple shadow-[0_0_10px_2px] shadow-neon-purple" />
        <h1 className="text-lg font-semibold">
          Hablando con <span className="text-neon-purple">Luki AI</span>
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-white/10 text-off-white'
                    : 'border border-electric-mint/30 bg-electric-mint/5 text-off-white'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isPending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl border border-neon-purple/30 bg-neon-purple/5 px-4 py-3 text-sm text-off-white/70">
                Luki está analizando tus gastos…
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-white/10 bg-[#0F172A] px-4 py-4 sm:px-8"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta a Luki..."
            disabled={isPending}
            className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm text-off-white placeholder:text-off-white/40 outline-none focus:ring-2 focus:ring-neon-purple disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isPending || !input.trim()}
            className="rounded-full bg-neon-purple px-5 py-2.5 text-sm font-medium text-off-white shadow-lg shadow-neon-purple/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdvisorChat
