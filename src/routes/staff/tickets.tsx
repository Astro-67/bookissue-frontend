import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/staff/tickets')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/staff/tickets"!</div>
}
