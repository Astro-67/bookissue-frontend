import { createFileRoute } from '@tanstack/react-router'
import StaffTicketsList from '../../features/tickets/components/StaffTicketsList'

export const Route = createFileRoute('/staff/tickets')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffTicketsList />
}
