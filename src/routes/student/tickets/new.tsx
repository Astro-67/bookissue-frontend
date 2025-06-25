import { createFileRoute } from '@tanstack/react-router'
import CreateTicketForm from '../../../features/tickets/components/CreateTicketForm'

export const Route = createFileRoute('/student/tickets/new')({
  component: CreateTicketForm,
})
