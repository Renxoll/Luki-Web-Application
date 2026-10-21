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
    <AppShell maxWidth="max-w-6xl" fit>
      <div className="animate-fade-up lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <PageHeader
          className="mb-6 lg:mb-3"
          title="Movimientos"
          subtitle={
            workspace && !workspace.isDefault
              ? `Movimientos del módulo “${workspace.name}”.`
              : 'Todo lo que Luki registró este mes. Ajusta la categoría o el módulo si algo no cuadra.'
          }
        />

        <WorkspaceSwitcher className="mb-3 lg:mb-2" />
        <SyncStatusBar className="mb-4 lg:mb-3" />

        {/* Escritorio: la lista arranca arriba a la izquierda; registrar gasto/ingreso queda
            en una columna fija a la derecha -- así no hay que bajar para ver los movimientos.
            Móvil: una sola columna, las acciones primero y la lista debajo. */}
        <div className="grid gap-x-6 gap-y-4 lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:grid-rows-1">
          <aside className="space-y-2 lg:order-2 lg:min-h-0 lg:overflow-y-auto">
            <RecordExpenseForm />
            <RecordIncomeForm />
          </aside>

          <div className="min-w-0 lg:order-1 lg:col-span-2 lg:min-h-0">
            <TransactionList key={workspaceIdParam ?? 'general'} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default Transactions
