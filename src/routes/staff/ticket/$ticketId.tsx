import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/staff/ticket/$ticketId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/staff/ticket/$ticketId"!</div>
}
