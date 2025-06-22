import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/student/_layout')({
  component: () => <Outlet />,
})
