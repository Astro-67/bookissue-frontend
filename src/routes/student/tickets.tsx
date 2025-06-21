import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/tickets')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/student/tickets"!</div>
}
