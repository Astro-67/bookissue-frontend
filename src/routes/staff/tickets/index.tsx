import { createFileRoute } from '@tanstack/react-router'
import UserTicketsList from '../../../features/tickets/components/UserTicketsList'

export const Route = createFileRoute('/staff/tickets/')({
  component: UserTicketsList,
})
