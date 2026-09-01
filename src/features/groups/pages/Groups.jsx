import { AppShell } from '../../../components/AppShell'
import { PageHeader } from '../../../components/PageHeader'
import { PendingGroupInvites } from '../components/PendingGroupInvites'
import { CreateGroupForm } from '../components/CreateGroupForm'
import { GroupsList } from '../components/GroupsList'

export function Groups() {
  return (
    <AppShell>
      <div className="animate-fade-up">
        <PageHeader title="Grupos" subtitle="Divide gastos con amigos, viajes o el depa. Sin números sueltos en WhatsApp." />
        <PendingGroupInvites />
        <CreateGroupForm />
        <GroupsList />
      </div>
    </AppShell>
  )
}

export default Groups
