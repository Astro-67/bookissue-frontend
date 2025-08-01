import { createFileRoute } from '@tanstack/react-router'
import UserTicketDetail from '../../../features/tickets/components/UserTicketDetail'

export const Route = createFileRoute('/student/tickets/$ticketId')({
  component: UserTicketDetail,
})
