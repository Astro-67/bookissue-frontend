import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/ict/_layout')({
  component: () => <Outlet />,
})

