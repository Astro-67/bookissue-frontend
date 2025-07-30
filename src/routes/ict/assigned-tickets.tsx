import { createFileRoute } from '@tanstack/react-router'
import { AssignedTickets } from '../../features/tickets/components/AssignedTickets'

export const Route = createFileRoute('/ict/assigned-tickets')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Assigned Issues</h1>
          <p className="text-gray-600 mt-1">
            Manage and resolve tickets that have been assigned to you
          </p>
        </div>
        
        <AssignedTickets />
      </div>
    </div>
  )
}
