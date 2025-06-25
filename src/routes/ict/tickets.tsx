import { createFileRoute } from '@tanstack/react-router'
import ICTTicketsList from '../../features/tickets/components/ICTTicketsList'

export const Route = createFileRoute('/ict/tickets')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ICTTicketsList />
}
