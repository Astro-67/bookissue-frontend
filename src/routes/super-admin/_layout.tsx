import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../../ui/LoadingSpinner'

function SuperAdminLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  // Check if user has super admin role
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this area.</p>
        </div>
      </div>
    )
  }

  return <Outlet />
}

export const Route = createFileRoute('/super-admin/_layout')({
  component: SuperAdminLayout,
})
