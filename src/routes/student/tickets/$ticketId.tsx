import { createFileRoute } from '@tanstack/react-router'
import StudentTicketDetail from '../../../features/tickets/components/StudentTicketDetail'

export const Route = createFileRoute('/student/tickets/$ticketId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StudentTicketDetail />
}
