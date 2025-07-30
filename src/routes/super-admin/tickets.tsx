import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTickets } from '../../hooks/api'
import type { Ticket } from '../../types/api'
import { 
  RiEyeLine,
  RiDeleteBinLine,
  RiEditLine,
  RiFilterLine,
  RiDownloadLine
} from 'react-icons/ri'

function SuperAdminTickets() {
  const { data: ticketsResponse, isLoading } = useTickets()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Handle different API response formats
  const tickets = Array.isArray(ticketsResponse) 
    ? ticketsResponse 
    : ticketsResponse?.results || ticketsResponse?.data || []

  const filteredTickets = tickets?.filter((ticket: Ticket) => {
    const statusMatch = selectedStatus === 'all' || ticket.status.toLowerCase() === selectedStatus
    return statusMatch
  }) || []

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Tickets</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive view and management of all system tickets
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RiDownloadLine className="mr-2 h-4 w-4" />
            Export
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RiFilterLine className="mr-2 h-4 w-4" />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Tickets
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title, description, or user..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title & User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket: Ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{ticket.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ticket.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        by {ticket.created_by?.first_name || ''} {ticket.created_by?.last_name || ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.assigned_to 
                      ? `${ticket.assigned_to.first_name || ''} ${ticket.assigned_to.last_name || ''}`
                      : 'Unassigned'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <RiEyeLine className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <RiEditLine className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <RiDeleteBinLine className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTickets.length === 0 && (
          <div className="px-6 py-12 text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No tickets match the selected criteria.
            </p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Statistics</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{tickets?.length || 0}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tickets?.filter((t: Ticket) => t.status === 'OPEN').length || 0}
            </div>
            <div className="text-sm text-gray-500">Open</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {tickets?.filter((t: Ticket) => t.status === 'IN_PROGRESS').length || 0}
            </div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tickets?.filter((t: Ticket) => t.status === 'RESOLVED').length || 0}
            </div>
            <div className="text-sm text-gray-500">Resolved</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/super-admin/tickets')({
  component: SuperAdminTickets,
})
