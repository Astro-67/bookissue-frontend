import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../contexts/AuthContext'
import { useTickets, useUsers } from '../../hooks/api'
import type { User } from '../../types/api'
import {
  RiBarChartBoxLine,
  RiGroupLine,
  RiShieldUserLine,
  RiTicketLine,
  RiUserLine,
} from 'react-icons/ri'

function SuperAdminDashboard() {
  const { user } = useAuth()
  const { data: ticketsResponse } = useTickets({})
  const { data: usersResponse } = useUsers({})

  // Extract arrays from API responses (handle pagination structure)
  const tickets = Array.isArray(ticketsResponse) 
    ? ticketsResponse 
    : ticketsResponse?.results || ticketsResponse?.data || []
    
  const users = Array.isArray(usersResponse) 
    ? usersResponse 
    : usersResponse?.results || usersResponse?.data || []

  const stats = [
    {
      name: 'Total Tickets',
      value: tickets?.length || 0,
      icon: RiTicketLine,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Users',
      value: users?.length || 0,
      icon: RiUserLine,
      color: 'bg-green-500',
    },
    {
      name: 'Staff Members',
      value: users?.filter((u: User) => ['staff', 'ict'].includes(u.role)).length || 0,
      icon: RiGroupLine,
      color: 'bg-purple-500',
    },
    {
      name: 'Active Users',
      value: users?.filter((u: User) => u.is_active).length || 0,
      icon: RiShieldUserLine,
      color: 'bg-emerald-500',
    },
  ]

  const quickActions = [
    {
      name: 'View All Tickets',
      href: '/super-admin/tickets',
      icon: RiTicketLine,
      description: 'Manage and oversee all system tickets',
    },
    {
      name: 'User Management',
      href: '/super-admin/users',
      icon: RiUserLine,
      description: 'Manage all users: students, staff, ICT, and admins',
    },
    {
      name: 'System Reports',
      href: '/super-admin/reports',
      icon: RiBarChartBoxLine,
      description: 'View system analytics and reports',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Super Admin Dashboard - System Overview and Management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} p-3 rounded-md`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="group relative bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                  <action.icon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent System Activity</h2>
        </div>
        <div className="px-6 py-4">
          <div className="text-sm text-gray-500">
            <p>Recent activity feed would go here...</p>
            <p className="mt-2">This would show recent tickets, user registrations, system events, etc.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/super-admin/dashboard')({
  component: SuperAdminDashboard,
})
