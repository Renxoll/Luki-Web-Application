import { Users } from 'lucide-react'
import { useMyGroups } from '../api/useMyGroups'
import { GroupCard } from './GroupCard'

function GroupsListSkeleton() {
  return (
    <div className="mt-5 space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-white/[0.05]" />
      ))}
    </div>
  )
}

export function GroupsList() {
  const { data: groups, isLoading, isError, error } = useMyGroups()

  if (isLoading) return <GroupsListSkeleton />

  if (isError) {
    return (
      <div className="card mt-5 border-orange-400/25 bg-orange-400/10 p-6">
        <p className="font-semibold text-orange-300">No pudimos cargar tus grupos</p>
        <p className="mt-1 text-sm text-off-white/60">{error?.message || 'Inténtalo de nuevo en unos minutos.'}</p>
      </div>
    )
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="card mt-5 flex flex-col items-center gap-3 p-10 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] text-off-white/40">
          <Users size={22} />
        </span>
        <p className="text-sm text-off-white/55">Todavía no tienes grupos. Crea uno para empezar a dividir gastos.</p>
      </div>
    )
  }

  return (
    <ul className="mt-5 space-y-2">
      {groups.map((group) => (
        <li key={group.groupId}>
          <GroupCard group={group} />
        </li>
      ))}
    </ul>
  )
}

export default GroupsList
