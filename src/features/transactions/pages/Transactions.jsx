import { RecordIncomeForm } from '../components/RecordIncomeForm'
import { TransactionList } from '../components/TransactionList'
import { AppShell } from '../../../components/AppShell'
import { PageHeader } from '../../../components/PageHeader'

export function Transactions() {
  return (
    <AppShell>
      <div className="animate-fade-up">
        <PageHeader
          title="Movimientos"
          subtitle="Todo lo que Luki registró este mes. Ajusta la categoría si algo no cuadra."
        />
        <div className="mt-1">
          <RecordIncomeForm />
        </div>
        <TransactionList />
      </div>
    </AppShell>
  )
}

export default Transactions
