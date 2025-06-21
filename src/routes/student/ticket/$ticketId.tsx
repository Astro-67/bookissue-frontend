import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/ticket/$ticketId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/student/ticket/$ticketId"!</div>
}
