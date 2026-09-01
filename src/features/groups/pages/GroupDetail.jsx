import { useParams } from 'react-router-dom'
import { AppShell } from '../../../components/AppShell'
import { PageHeader } from '../../../components/PageHeader'
import { Button } from '../../../components/Button'
import { useGroupDetail } from '../api/useGroupDetail'
import { MembersList } from '../components/MembersList'
import { InviteMemberForm } from '../components/InviteMemberForm'
import { AddExpenseForm } from '../components/AddExpenseForm'
import { ExpensesList } from '../components/ExpensesList'
import { SimplifiedDebts } from '../components/SimplifiedDebts'

function GroupDetailSkeleton() {
  return (
    <div className="mt-5 space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/[0.05]" />
      ))}
    </div>
  )
}

export function GroupDetail() {
  const { groupId } = useParams()
  const { data: group, isLoading, isError, error } = useGroupDetail(groupId)

  if (isLoading) {
    return (
      <AppShell maxWidth="max-w-2xl">
        <div className="animate-fade-up">
          <PageHeader title="Grupo" back="/groups" />
          <GroupDetailSkeleton />
        </div>
      </AppShell>
    )
  }

  if (isError || !group) {
    const isNotFound = error?.response?.status === 404
    return (
      <AppShell maxWidth="max-w-2xl">
        <div className="animate-fade-up">
          <PageHeader title="Grupo" back="/groups" />
          <div className="card border-orange-400/25 bg-orange-400/10 p-6">
            <p className="font-semibold text-orange-300">
              {isNotFound ? 'No encontramos este grupo' : 'No pudimos cargar el grupo'}
            </p>
            <p className="mt-1 text-sm text-off-white/60">
              {isNotFound ? 'O no existe, o ya no eres miembro.' : error?.message || 'Inténtalo de nuevo en unos minutos.'}
            </p>
            <Button to="/groups" variant="subtle" size="sm" className="mt-3">
              Volver a Grupos
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell maxWidth="max-w-2xl">
      <div className="animate-fade-up space-y-6">
        <div>
          <PageHeader title={group.name} back="/groups" />
          <MembersList members={group.members} />
          <InviteMemberForm groupId={groupId} />
        </div>

        <div>
          <p className="section-title">Deudas simplificadas</p>
          <div className="mt-2">
            <SimplifiedDebts groupId={groupId} suggestions={group.simplifiedDebts} />
          </div>
        </div>

        <div>
          <p className="section-title">Gastos</p>
          <div className="mt-2 space-y-2">
            <AddExpenseForm groupId={groupId} members={group.members} />
            <ExpensesList expenses={group.expenses} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default GroupDetail
