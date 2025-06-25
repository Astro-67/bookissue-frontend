import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/student/tickets')({
  component: () => <Outlet />,
})
