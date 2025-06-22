import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/staff/_layout')({
  component: () => <Outlet />,
})
