import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ict/ticket/$ticketId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ict/ticket/$ticketId"!</div>
}
