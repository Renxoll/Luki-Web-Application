import { RecordIncomeForm } from '../components/RecordIncomeForm'
import { TransactionList } from '../components/TransactionList'
import { AppShell } from '../../../components/AppShell'
import { PageHeader } from '../../../components/PageHeader'
import { WorkspaceSwitcher } from '../../workspaces/components/WorkspaceSwitcher'
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

        <div className="mt-1">
          <RecordIncomeForm />
        </div>
        <TransactionList key={workspaceIdParam ?? 'general'} />
      </div>
    </AppShell>
  )
}

export default Transactions
