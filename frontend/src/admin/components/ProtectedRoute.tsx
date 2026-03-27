import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermissions?: string[]
}

const ProtectedRoute = ({ children, requiredPermissions = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth()

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950" />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission))
    if (!hasAllPermissions) {
      return <Navigate to="/admin" replace />
    }
  }
  
  return <>{children}</>
}

export default ProtectedRoute