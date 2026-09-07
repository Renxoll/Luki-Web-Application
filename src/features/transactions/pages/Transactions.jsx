import { RecordIncomeForm } from '../components/RecordIncomeForm'
import { RecordExpenseForm } from '../components/RecordExpenseForm'
import { TransactionList } from '../components/TransactionList'
import { AppShell } from '../../../components/AppShell'
import { PageHeader } from '../../../components/PageHeader'
import { WorkspaceSwitcher } from '../../workspaces/components/WorkspaceSwitcher'
import { SyncStatusBar } from '../../gmailsync/components/SyncStatusBar'
import { useActiveWorkspace } from '../../workspaces/api/useActiveWorkspace'

export function Transactions() {
  const { workspace, workspaceIdParam } = useActiveWorkspace()

  return (
    <AppShell>
      <div className="animate-fade-up">
        <PageHeader
          title="Movimientos"
          subtitle={
            workspace && !workspace.isDefault
              ? `Movimientos del módulo “${workspace.name}”.`
              : 'Todo lo que Luki registró este mes. Ajusta la categoría o el módulo si algo no cuadra.'
          }
        />

        <WorkspaceSwitcher className="mb-4" />

        <SyncStatusBar className="mb-4" />

        <div className="mt-1 space-y-2">
          <RecordExpenseForm />
          <RecordIncomeForm />
        </div>
        <TransactionList key={workspaceIdParam ?? 'general'} />
      </div>
    </AppShell>
  )
}

export default Transactions
