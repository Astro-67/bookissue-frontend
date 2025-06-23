import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SharedLayout } from '../ui/SharedLayout'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

const queryClient = new QueryClient()

function AuthenticatedApp() {
  const router = useRouterState()
  const pathname = router.location.pathname
  const { isAuthenticated, isLoading, user } = useAuth()

  console.log('AuthenticatedApp:', { pathname, isAuthenticated, isLoading, user: user?.email || 'none' });

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('Showing loading spinner');
    return <LoadingSpinner />
  }

  // Determine if we should show the layout
  const isAuthPage = pathname === '/login' || pathname === '/'
  
  // If user is not authenticated and not on auth page, redirect to login
  if (!isAuthenticated && !isAuthPage) {
    console.log('Not authenticated, redirecting to login');
    window.location.href = '/login'
    return <LoadingSpinner />
  }

  // If user is authenticated and has user data but on auth page, redirect to dashboard
  // If user is authenticated and has user data but on auth page, redirect to dashboard
  if (isAuthenticated && user && (pathname === '/login' || pathname === '/')) {
    console.log('Authenticated user on auth page, redirecting to dashboard');
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
