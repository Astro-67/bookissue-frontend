import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/staff/tickets/assigned')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/staff/tickets/assigned"!</div>
}
