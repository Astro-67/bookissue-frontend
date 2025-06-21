import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/staff/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/staff/dashboard"!</div>
}
