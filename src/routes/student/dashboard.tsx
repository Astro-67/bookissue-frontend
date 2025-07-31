import { createFileRoute, Link } from '@tanstack/react-router'
import { useRealTimeTickets, useCurrentUser } from '../../hooks/api'
import { 
  RiBookLine, 
  RiTimeLine, 
  RiAlertLine, 
  RiCheckboxCircleLine,
  RiEyeLine,
  RiAddLine
} from 'react-icons/ri'
import { useMemo } from 'react'
import type { Ticket } from '../../types/api'

export const Route = createFileRoute('/student/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: currentUser } = useCurrentUser()
  const { data: ticketsData, isLoading } = useRealTimeTickets({
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Student Dashboard</h2>
        <p className="text-blue-100">
          Welcome back, {currentUser?.first_name || 'Student'}! Manage your book requests and track your issued books.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <Link
              to="/student/tickets"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="p-6">
            {recentTickets.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No book requests yet</p>
                <Link
                  to="/student/tickets/new"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Your First Request
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTickets.slice(0, 3).map((ticket: Ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <Link
                        to="/student/tickets/$ticketId"
                        params={{ ticketId: ticket.id.toString() }}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {ticket.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {ticket.description?.substring(0, 50)}...
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimeAgo(ticket.updated_at || ticket.created_at)}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
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
            <div className="space-y-4">
              <Link
                to="/student/tickets/new"
                className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <RiAddLine className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">New Book Request</p>
                  <p className="text-sm text-gray-500">Request a new book from the library</p>
                </div>
              </Link>

              <Link
                to="/student/tickets"
                className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <RiEyeLine className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">View My Requests</p>
                  <p className="text-sm text-gray-500">Check status of your submitted requests</p>
                </div>
              </Link>

              <Link
                to="/student/profile"
                className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">My Profile</p>
                  <p className="text-sm text-gray-500">Update your account information</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
