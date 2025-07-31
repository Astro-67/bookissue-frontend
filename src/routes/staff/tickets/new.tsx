import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/staff/tickets/new')({
  component: () => <div>Create new ticket for staff</div>,
})
