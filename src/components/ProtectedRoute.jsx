import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checking } = useAuth()

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app text-muted">
        <span className="text-sm">Loading…</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
