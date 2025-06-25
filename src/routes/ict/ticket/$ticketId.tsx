import { createFileRoute } from '@tanstack/react-router'
import ICTTicketDetail from '../../../features/tickets/components/ICTTicketDetail'

export const Route = createFileRoute('/ict/ticket/$ticketId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ICTTicketDetail />
}
