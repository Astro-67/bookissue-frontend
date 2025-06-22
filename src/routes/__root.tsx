import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SharedLayout } from '../ui/SharedLayout'

function RootComponent() {
  const router = useRouterState()
  const pathname = router.location.pathname

  // Determine if we should show the layout
  const isAuthPage = pathname === '/login' || pathname === '/' || pathname === '/404'
  
  // Determine the role based on the current path
  let role: 'student' | 'staff' | 'ict' = 'student'
  if (pathname.startsWith('/staff')) {
    role = 'staff'
  } else if (pathname.startsWith('/ict')) {
    role = 'ict'
  } else if (pathname.startsWith('/student')) {
    role = 'student'
  }

  if (isAuthPage) {
    // Don't show layout for auth pages
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    )
  }

  // Show layout for dashboard pages
  return (
    <>
      <SharedLayout role={role}>
        <Outlet />
      </SharedLayout>
      <TanStackRouterDevtools />
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
