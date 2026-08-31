import { GmailAccountsPanel } from '../components/GmailAccountsPanel'
import { AppShell } from '../../../components/AppShell'
import { PageHeader } from '../../../components/PageHeader'

export function GmailAccounts() {
  return (
    <AppShell maxWidth="max-w-2xl">
      <div className="animate-fade-up">
        <PageHeader
          title="Cuentas de Gmail"
          subtitle="Luki solo lee las notificaciones de banca y billeteras. Nada más."
          back="/dashboard"
        />
        <GmailAccountsPanel />
      </div>
    </AppShell>
  )
}

export default GmailAccounts
