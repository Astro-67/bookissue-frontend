import React, { useState, useEffect, useRef } from 'react'
import { RiMenuLine, RiNotificationLine, RiArrowDownSLine, RiUserLine, RiLogoutBoxLine } from 'react-icons/ri'

interface HeaderProps {
  title: string
  userName: string
  userAvatar: string
  onMobileMenuToggle: () => void
  onLogout: () => void
}

export const Header: React.FC<HeaderProps> = ({
  title,
  userName,
  userAvatar,
  onMobileMenuToggle,
  onLogout
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 active:scale-95"
            aria-label="Open menu"
          >
            <RiMenuLine className="h-6 w-6" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-gray-900 truncate">
              {title}
            </h1>
            <p className="text-sm text-gray-500 truncate hidden sm:block">Welcome back, {userName}</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <RiNotificationLine className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {userAvatar}
                </span>
              </div>
              <RiArrowDownSLine className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">Signed in</p>
                  </div>
                  <button
                    onClick={() => {
                      // Handle profile click
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <RiUserLine className="mr-3 h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <RiLogoutBoxLine className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
