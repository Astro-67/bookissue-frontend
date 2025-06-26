import { createFileRoute, Link } from '@tanstack/react-router'
import { useRealTimeTickets, useCurrentUser } from '../../hooks/api'
import { 
  RiBookLine, 
  RiTimeLine, 
  RiAlertLine, 
  RiCheckboxCircleLine,
  RiEyeLine,
  RiAddLine,
  RiRefreshLine
} from 'react-icons/ri'
import { useMemo } from 'react'
import type { Ticket } from '../../types/api'

export const Route = createFileRoute('/student/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: currentUser } = useCurrentUser()
  const { data: ticketsData, isLoading, isUpdating } = useRealTimeTickets({
    created_by: currentUser?.id
  })

  // Handle both array and paginated response
  const tickets = useMemo(() => {
    if (!ticketsData) return []
    
    if (Array.isArray(ticketsData)) {
      return ticketsData
    }
    
    if (ticketsData.results && Array.isArray(ticketsData.results)) {
      return ticketsData.results
    }
    
    return []
  }, [ticketsData])

  // Calculate statistics
  const stats = useMemo(() => {
    const openTickets = tickets.filter((ticket: Ticket) => ticket.status === 'OPEN')
    const inProgressTickets = tickets.filter((ticket: Ticket) => ticket.status === 'IN_PROGRESS')
    const resolvedTickets = tickets.filter((ticket: Ticket) => ticket.status === 'RESOLVED')
    
    // Calculate due soon (tickets in progress for more than 5 days)
    const dueSoon = inProgressTickets.filter((ticket: Ticket) => {
      const daysSinceCreated = Math.floor(
        (Date.now() - new Date(ticket.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysSinceCreated > 5
    })

    return {
      total: tickets.length,
      open: openTickets.length,
      inProgress: inProgressTickets.length,
      resolved: resolvedTickets.length,
      dueSoon: dueSoon.length
    }
  }, [tickets])

  // Get recent tickets for activity
  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
      .slice(0, 5)
  }, [tickets])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-100 text-red-600'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-600'
      case 'RESOLVED':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <RiAlertLine className="w-3 h-3" />
      case 'IN_PROGRESS':
        return <RiTimeLine className="w-3 h-3" />
      case 'RESOLVED':
        return <RiCheckboxCircleLine className="w-3 h-3" />
      default:
        return <RiTimeLine className="w-3 h-3" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {currentUser?.full_name || 'Student'}!
            </h2>
            <p className="text-indigo-100">Manage your book requests and track your issued books.</p>
          </div>
          <div className="flex items-center space-x-2">
            {isUpdating && (
              <RiRefreshLine className="w-5 h-5 text-indigo-200 animate-spin" />
            )}
            <Link
              to="/student/tickets"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RiAddLine className="w-4 h-4" />
              <span>New Request</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <RiBookLine className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                <RiAlertLine className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Open Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.open}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <RiTimeLine className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <RiCheckboxCircleLine className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <Link
            to="/student/tickets"
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <RiEyeLine className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-6">
          {recentTickets.length === 0 ? (
            <div className="text-center py-8">
              <RiBookLine className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No book requests yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first book request.
              </p>
              <div className="mt-6">
                <Link
                  to="/student/tickets"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <RiAddLine className="w-4 h-4 mr-2" />
                  Create Request
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1">{ticket.status.replace('_', ' ')}</span>
                    </span>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{ticket.title}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(ticket.updated_at || ticket.created_at)}
                    </span>
                    <Link
                      to="/student/tickets/$ticketId"
                      params={{ ticketId: ticket.id.toString() }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <RiEyeLine className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/student/tickets"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors group"
            >
              <RiAddLine className="w-8 h-8 text-gray-400 group-hover:text-indigo-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-900">
                  New Book Request
                </p>
                <p className="text-sm text-gray-500 group-hover:text-indigo-700">
                  Request a new book from the library
                </p>
              </div>
            </Link>

            <Link
              to="/student/tickets"
              search={{ status: 'OPEN' }}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors group"
            >
              <RiAlertLine className="w-8 h-8 text-gray-400 group-hover:text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 group-hover:text-red-900">
                  View Open Requests
                </p>
                <p className="text-sm text-gray-500 group-hover:text-red-700">
                  Check your pending book requests
                </p>
              </div>
            </Link>

            <Link
              to="/student/profile"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group"
            >
              <RiCheckboxCircleLine className="w-8 h-8 text-gray-400 group-hover:text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 group-hover:text-green-900">
                  Update Profile
                </p>
                <p className="text-sm text-gray-500 group-hover:text-green-700">
                  Manage your account settings
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
