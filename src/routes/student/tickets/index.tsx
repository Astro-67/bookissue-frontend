import { createFileRoute } from '@tanstack/react-router'
import StudentTicketsList from '../../../features/tickets/components/StudentTicketsList'

export const Route = createFileRoute('/student/tickets/')({
  component: StudentTicketsList,
})
