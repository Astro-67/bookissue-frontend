import React from 'react'
import { Link } from '@tanstack/react-router'
import { RiBookLine, RiCloseLine, RiLogoutBoxLine } from 'react-icons/ri'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface User {
  name: string
  id: string
  avatar: string
}

interface SidebarProps {
  title: string
  navigation: NavigationItem[]
  user: User
  sidebarOpen: boolean
  onSidebarClose: () => void
  isActive: (href: string) => boolean
  onSignOut: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  title,
  navigation,
  user,
  sidebarOpen,
  onSidebarClose,
  isActive,
  onSignOut
}) => {
  return (
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
              <div className="text-xs text-blue-100">{title}</div>
            </div>
          </div>
          <button
            onClick={onSidebarClose}
            className="lg:hidden p-2 rounded-md text-blue-100 hover:bg-blue-700 transition-colors"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
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
                {user.avatar}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.id}
              </p>
            </div>
          </div>
          <button 
            onClick={onSignOut}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
          >
            <RiLogoutBoxLine className="mr-3 h-5 w-5 text-gray-500" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
