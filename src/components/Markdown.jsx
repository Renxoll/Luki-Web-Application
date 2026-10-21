import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Renderiza markdown (negritas, listas, tablas, código) con los estilos de la app. Las
 * respuestas del asesor llegan en markdown: sin esto se ven los `**` y los `-` tal cual.
 * react-markdown no interpreta HTML crudo, así que no hace falta sanitizar lo que devuelve el LLM.
 */
const components = {
  p: (props) => <p className="[&:not(:first-child)]:mt-2" {...props} />,
  strong: (props) => <strong className="font-semibold text-off-white" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  ul: (props) => <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-electric-mint/70" {...props} />,
  ol: (props) => <ol className="mt-2 list-decimal space-y-1 pl-5 marker:text-electric-mint/70" {...props} />,
  li: (props) => <li className="pl-0.5" {...props} />,
  h1: (props) => <h3 className="mt-3 text-base font-bold first:mt-0" {...props} />,
  h2: (props) => <h3 className="mt-3 text-base font-bold first:mt-0" {...props} />,
  h3: (props) => <h4 className="mt-3 text-sm font-bold first:mt-0" {...props} />,
  h4: (props) => <h4 className="mt-3 text-sm font-semibold first:mt-0" {...props} />,
  a: (props) => (
    <a className="text-neon-purple underline underline-offset-2" target="_blank" rel="noreferrer noopener" {...props} />
  ),
  blockquote: (props) => <blockquote className="mt-2 border-l-2 border-white/20 pl-3 text-off-white/70" {...props} />,
  hr: () => <hr className="my-3 border-white/10" />,
  code: ({ className, ...props }) => (
    <code
      className={`rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em] ${className ?? ''}`}
      {...props}
    />
  ),
  pre: (props) => <pre className="mt-2 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs [&_code]:bg-transparent [&_code]:p-0" {...props} />,
  table: (props) => (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b border-white/15 px-2 py-1.5 font-semibold" {...props} />,
  td: (props) => <td className="border-b border-white/[0.06] px-2 py-1.5" {...props} />,
}

export function Markdown({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
