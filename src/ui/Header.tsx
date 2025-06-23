import React from 'react'
import { RiMenuLine, RiNotificationLine } from 'react-icons/ri'

interface HeaderProps {
  title: string
  userName: string
  userAvatar: string
  onMobileMenuToggle: () => void
}

export const Header: React.FC<HeaderProps> = ({
  title,
  userName,
  userAvatar,
  onMobileMenuToggle
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <RiMenuLine className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {title}
            </h1>
            <p className="text-sm text-gray-500">Welcome back, {userName}</p>
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
              {userAvatar}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
