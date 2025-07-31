import { createFileRoute } from '@tanstack/react-router'
import UserTicketDetail from '../../../features/tickets/components/UserTicketDetail'

export const Route = createFileRoute('/staff/tickets/$ticketId')({
  component: UserTicketDetail,
})
