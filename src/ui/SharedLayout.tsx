import React, { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { 
  RiDashboardLine, 
  RiTicketLine, 
  RiAddLine, 
  RiUserLine, 
  RiTeamLine, 
  RiBookLine, 
  RiBarChartBoxLine, 
  RiAlertLine, 
  RiGroupLine, 
  RiSettingsLine,
  RiNotificationLine,
  RiCloseLine,
  RiMenuLine,
  RiLogoutBoxLine
} from 'react-icons/ri'

interface SharedLayoutProps {
  role: 'student' | 'staff' | 'ict'
  children: React.ReactNode
}

// Role configuration with navigation and styling
const roleConfig = {
  student: {
    title: 'Student Portal',
    navigation: [
      { name: 'Dashboard', href: '/student/dashboard', icon: RiDashboardLine },
      { name: 'My Issues', href: '/student/tickets', icon: RiTicketLine },
      { name: 'Submit Issue', href: '/student/tickets/new', icon: RiAddLine },
      { name: 'Profile', href: '/student/profile', icon: RiUserLine },
    ],
    user: {
      name: 'John Doe',
      id: '2024001',
      avatar: 'JD'
    }
  },
  staff: {
    title: 'Staff Portal',
    navigation: [
      { name: 'Dashboard', href: '/staff/dashboard', icon: RiDashboardLine },
      { name: 'All Issues', href: '/staff/tickets', icon: RiTicketLine },
      { name: 'My Assigned', href: '/staff/tickets/assigned', icon: RiTeamLine },
      { name: 'Book Management', href: '/staff/books', icon: RiBookLine },
      { name: 'Reports', href: '/staff/reports', icon: RiBarChartBoxLine },
    ],
    user: {
      name: 'Alice Smith',
      id: 'Library Staff',
      avatar: 'AS'
    }
  },
  ict: {
    title: 'ICT Admin',
    navigation: [
      { name: 'Dashboard', href: '/ict/dashboard', icon: RiDashboardLine },
      { name: 'All Issues', href: '/ict/tickets', icon: RiTicketLine },
      { name: 'Critical Issues', href: '/ict/tickets/critical', icon: RiAlertLine },
      { name: 'User Management', href: '/ict/users', icon: RiGroupLine },
      { name: 'System Settings', href: '/ict/settings', icon: RiSettingsLine },
      { name: 'Analytics', href: '/ict/analytics', icon: RiBarChartBoxLine },
    ],
    user: {
      name: 'Mike Taylor',
      id: 'ICT Administrator',
      avatar: 'MT'
    }
  }
}

export const SharedLayout: React.FC<SharedLayoutProps> = ({ role, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouterState()
  const config = roleConfig[role]

  const isActive = (href: string) => {
    return router.location.pathname === href
  }

  const handleSignOut = () => {
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
            <div className="flex items-center space-x-3">
              <RiBookLine className="w-8 h-8" />
              <div>
                <div className="font-bold text-lg">BookIssue</div>
                <div className="text-xs text-blue-100">{config.title}</div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-blue-100 hover:bg-blue-700 transition-colors"
            >
              <RiCloseLine className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {config.navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 transition-colors ${
                    active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                  }`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {config.user.avatar}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {config.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {config.user.id}
                </p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
            >
              <RiLogoutBoxLine className="mr-3 h-5 w-5 text-gray-500" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <RiMenuLine className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {config.title}
                </h1>
                <p className="text-sm text-gray-500">Welcome back, {config.user.name}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <RiNotificationLine className="h-6 w-6" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
              </button>

              {/* User avatar */}
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <span className="text-sm font-medium text-white">
                  {config.user.avatar}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex justify-center space-x-6 md:order-2">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  Help
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  Support
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  Privacy
                </a>
              </div>
              <div className="mt-8 md:mt-0 md:order-1">
                <p className="text-center md:text-left text-base text-gray-500">
                  &copy; 2025 BookIssue Tracker System. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
