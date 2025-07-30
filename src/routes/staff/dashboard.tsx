import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../contexts/AuthContext'
import { useTickets } from '../../hooks/api'
import type { Ticket } from '../../types/api'

export const Route = createFileRoute('/staff/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  const { data: ticketsResponse } = useTickets({})

  // Extract arrays from API responses (handle pagination structure)
  const tickets = Array.isArray(ticketsResponse) 
    ? ticketsResponse 
    : ticketsResponse?.results || ticketsResponse?.data || []

  // Calculate statistics for staff
  const myTickets = tickets?.filter((t: Ticket) => 
    t.created_by?.id === user?.id
  ).length || 0

  const openTickets = tickets?.filter((t: Ticket) => 
    t.status === 'OPEN' && t.created_by?.id === user?.id
  ).length || 0

  const inProgressTickets = tickets?.filter((t: Ticket) => 
    t.status === 'IN_PROGRESS' && t.created_by?.id === user?.id
  ).length || 0

  const resolvedTickets = tickets?.filter((t: Ticket) => 
    t.status === 'RESOLVED' && t.created_by?.id === user?.id
  ).length || 0
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Staff Dashboard</h2>
        <p className="text-emerald-100">Manage book issues, assist students, and track library operations.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Open Issues</p>
              <p className="text-2xl font-semibold text-gray-900">{openTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{inProgressTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">{resolvedTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">My Total Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{myTickets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Assigned Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Issues */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Issues</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Book Request Failed</p>
                  <p className="text-sm text-gray-500">Student ID: 2024001 - John Doe</p>
                </div>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Urgent
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Missing Book Report</p>
                  <p className="text-sm text-gray-500">Student ID: 2024089 - Sarah Wilson</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Medium
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Book Return Delayed</p>
                  <p className="text-sm text-gray-500">Student ID: 2024034 - Mike Johnson</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Low
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* My Assigned Issues */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">My Assigned Issues</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Book ISBN Verification</p>
                  <p className="text-sm text-gray-500">Due: Today</p>
                </div>
                <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full">
                  Complete
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Student Account Review</p>
                  <p className="text-sm text-gray-500">Due: Tomorrow</p>
                </div>
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  In Progress
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Book Damage Assessment</p>
                  <p className="text-sm text-gray-500">Due: Next Week</p>
                </div>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                  Pending
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
