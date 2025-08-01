import { createFileRoute } from '@tanstack/react-router'
import UserTicketsList from '../../../features/tickets/components/UserTicketsList'

export const Route = createFileRoute('/student/tickets/')({
  component: UserTicketsList,
})
