import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ict/tickets/assigned')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ict/tickets/assigned"!</div>
}
