import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import Landing from '../features/marketing/pages/Landing'
import PrivacyPolicy from '../features/marketing/pages/PrivacyPolicy'
import Terms from '../features/marketing/pages/Terms'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import Dashboard from '../features/dashboard/pages/Dashboard'
import Advisor from '../features/advisor/pages/Advisor'
import Transactions from '../features/transactions/pages/Transactions'
import GmailAccounts from '../features/gmailsync/pages/GmailAccounts'

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token)
  return token ? children : <Navigate to="/login" replace />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisor"
          element={
            <ProtectedRoute>
              <Advisor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gmail-accounts"
          element={
            <ProtectedRoute>
              <GmailAccounts />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
