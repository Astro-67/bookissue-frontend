import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'
import { SharedLayout } from '../ui/SharedLayout'


function AuthenticatedApp() {
  const router = useRouterState()
  const pathname = router.location.pathname
  const { isAuthenticated, isLoading, user } = useAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Determine if we should show the layout
  const isAuthPage = pathname === '/login' || pathname === '/'
  
  // If user is not authenticated and not on auth page, redirect to login
  if (!isAuthenticated && !isAuthPage) {
    window.location.href = '/login'
    return <LoadingSpinner />
  }

  // If user is authenticated and has user data but on auth page, redirect to dashboard
  if (isAuthenticated && user && (pathname === '/login' || pathname === '/')) {
    window.location.href = `/${user.role}/dashboard`
    return <LoadingSpinner />
  }
  
  // Determine the role based on the current path or user role
  let role: 'student' | 'staff' | 'ict' = user?.role || 'student'
  if (pathname.startsWith('/staff')) {
    role = 'staff'
  } else if (pathname.startsWith('/ict')) {
    role = 'ict'
  } else if (pathname.startsWith('/student')) {
    role = 'student'
  }

  return (
    <>
      {(pathname === '/login' || pathname === '/') ? (
        // No layout for auth pages
        <Outlet />
      ) : (
        // Show layout for dashboard pages
        <SharedLayout role={role}>
          <Outlet />
        </SharedLayout>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools />
    </>
  )
}

function RootComponent() {
  return (
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
