import { createFileRoute } from '@tanstack/react-router'
import StaffTicketDetail from '../../../features/tickets/components/StaffTicketDetail'

export const Route = createFileRoute('/staff/ticket/$ticketId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffTicketDetail />
}
