import { Sparkles } from 'lucide-react'
import { useAuthStore } from '../../../store/useAuthStore'
import { useRecordSettlement } from '../api/useRecordSettlement'
import { formatMoney } from '../lib/formatMoney'
import { Button } from '../../../components/Button'

function SuggestionRow({ groupId, suggestion }) {
  const currentUserId = useAuthStore((state) => state.user?.id)
  const { mutate, isPending } = useRecordSettlement(groupId)
  const isYourDebt = suggestion.fromUserId === currentUserId

  const fromLabel = isYourDebt ? 'Tú' : suggestion.fromDisplayName
  const toLabel = suggestion.toUserId === currentUserId ? 'ti' : suggestion.toDisplayName

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] p-3">
      <p className="text-sm text-off-white/80">
        <span className="font-medium text-off-white">{fromLabel}</span> le debe{' '}
        <span className="font-semibold text-off-white">{formatMoney(suggestion.amount, suggestion.currency)}</span> a {toLabel}
      </p>
      {isYourDebt && (
        <Button
          variant="mint"
          size="sm"
          className="shrink-0"
          loading={isPending}
          onClick={() =>
            mutate({ toUserId: suggestion.toUserId, amount: suggestion.amount, currency: suggestion.currency })
          }
        >
          {isPending ? 'Guardando…' : 'Marcar como pagado'}
        </Button>
      )}
    </li>
  )
}

export function SimplifiedDebts({ groupId, suggestions }) {
  if (suggestions.length === 0) {
    return (
      <div className="card flex items-center gap-3 p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-400/15 text-emerald-300">
          <Sparkles size={16} strokeWidth={2.2} />
        </span>
        <p className="text-sm text-off-white/70">Todo saldado. Nadie le debe nada a nadie.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {suggestions.map((suggestion) => (
        <SuggestionRow
          key={`${suggestion.fromUserId}-${suggestion.toUserId}-${suggestion.currency}`}
          groupId={groupId}
          suggestion={suggestion}
        />
      ))}
    </ul>
  )
}

export default SimplifiedDebts
